// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1"

// CORS headers for secure browser communication
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

// In-memory rate limiting map (IP / Registration number -> timestamps)
const rateLimitMap = new Map<string, number[]>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 60 * 1000 // 1 minute

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(key) || []
  const recent = timestamps.filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  rateLimitMap.set(key, recent)
  return recent.length > MAX_ATTEMPTS
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  try {
    const clientIp = req.headers.get("x-forwarded-for") || "unknown-ip"
    const body = await req.json().catch(() => null)

    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ error: "Invalid request payload." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const { registrationNumber, password } = body

    // 1. Validate inputs safely
    if (
      typeof registrationNumber !== "string" ||
      typeof password !== "string" ||
      registrationNumber.trim().length < 3 ||
      registrationNumber.trim().length > 30 ||
      password.length < 4 ||
      password.length > 100
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid registration number or password." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const sanitizedRegNo = registrationNumber.trim().toUpperCase()

    // 2. Check rate limit
    if (isRateLimited(`${clientIp}_${sanitizedRegNo}`)) {
      return new Response(
        JSON.stringify({
          error: "Too many login attempts. Please wait 60 seconds before trying again.",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // 3. Initialize server-side Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")

    if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
      console.error("Missing required server environment variables.")
      return new Response(
        JSON.stringify({ error: "Server authentication service configuration error." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey)

    // 4. Resolve registration number to profile securely on server
    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("id, role, display_name, grade_level, avatar_id")
      .eq("registration_number", sanitizedRegNo)
      .eq("role", "student")
      .maybeSingle()

    // Generic failure message to prevent account enumeration
    const genericAuthError = "Invalid registration number or password."

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: genericAuthError }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // 5. Retrieve internal user record to resolve email mapping securely
    const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(
      profile.id
    )

    if (userError || !userData?.user?.email) {
      return new Response(JSON.stringify({ error: genericAuthError }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // 6. Authenticate student credentials via standard Supabase auth
    const anonClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data: authData, error: signInError } = await anonClient.auth.signInWithPassword({
      email: userData.user.email,
      password: password,
    })

    if (signInError || !authData.session) {
      return new Response(JSON.stringify({ error: genericAuthError }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // 7. Return session and public student profile without leaking private email or credentials
    return new Response(
      JSON.stringify({
        session: {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_at: authData.session.expires_at,
          expires_in: authData.session.expires_in,
          token_type: authData.session.token_type,
        },
        profile: {
          id: profile.id,
          role: profile.role,
          displayName: profile.display_name,
          gradeLevel: profile.grade_level,
          avatarId: profile.avatar_id,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (err) {
    console.error("Unhandled error in student-login Edge Function:", err)
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred during student sign-in." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
