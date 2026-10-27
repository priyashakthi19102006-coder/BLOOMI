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
      return new Response(JSON.stringify({ error: "Invalid registration payload." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const {
      displayName,
      registrationNumber,
      password,
      avatarId = "panda",
      gradeLevel = 3,
      classCode,
    } = body

    // 1. Input Validation
    if (
      typeof displayName !== "string" ||
      displayName.trim().length < 2 ||
      displayName.trim().length > 40
    ) {
      return new Response(
        JSON.stringify({ error: "Display name must be between 2 and 40 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    if (
      typeof registrationNumber !== "string" ||
      registrationNumber.trim().length < 3 ||
      registrationNumber.trim().length > 30 ||
      !/^[A-Za-z0-9_-]+$/.test(registrationNumber.trim())
    ) {
      return new Response(
        JSON.stringify({
          error: "Registration code must be 3-30 letters, numbers, or hyphens (e.g. BLOOMI-3A-01).",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    if (typeof password !== "string" || password.length < 6 || password.length > 100) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 6 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    if (
      typeof classCode !== "string" ||
      classCode.trim().length < 3 ||
      classCode.trim().length > 20
    ) {
      return new Response(
        JSON.stringify({
          error: "Please enter your teacher's classroom joining code (e.g. BLOOMI-3A).",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const validAvatars = ["lion", "panda", "fox", "dolphin"]
    const sanitizedAvatar = validAvatars.includes(avatarId) ? avatarId : "panda"
    const sanitizedRegNo = registrationNumber.trim().toUpperCase()
    const sanitizedName = displayName.trim()
    const sanitizedClassCode = classCode.trim().toUpperCase()

    // 2. Check rate limit
    if (isRateLimited(`${clientIp}_${sanitizedRegNo}`)) {
      return new Response(
        JSON.stringify({
          error: "Too many sign-up attempts. Please wait 60 seconds before trying again.",
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
    const anonClient = createClient(supabaseUrl, supabaseAnonKey)

    // 4. Validate classroom joining code
    const { data: matchedClass, error: classLookupErr } = await adminClient
      .from("classes")
      .select("id, name, class_code, grade_level, teacher_id")
      .ilike("class_code", sanitizedClassCode)
      .maybeSingle()

    if (classLookupErr) {
      console.error("Error looking up classroom code:", classLookupErr)
      return new Response(
        JSON.stringify({ error: "Failed to verify classroom code. Please check your connection and try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    if (!matchedClass) {
      return new Response(
        JSON.stringify({
          error: "The classroom code is invalid or expired. Please verify the code with your teacher.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // 5. Check if registration number is already registered
    const { data: existingProfile, error: checkError } = await adminClient
      .from("profiles")
      .select("id, role, registration_number, display_name")
      .eq("registration_number", sanitizedRegNo)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing profile:", checkError)
      return new Response(
        JSON.stringify({ error: "Failed to verify registration code. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    let authUserId: string | null = null
    let internalEmail: string | null = null

    if (existingProfile) {
      // If code is already assigned to an active profile, reject duplicate registration with clear guidance
      return new Response(
        JSON.stringify({
          error: "This registration code is already registered. If this is your account, please switch to Sign In with your adventure password.",
        }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // 6. Create Fresh Student Account via Auth Admin API
    const safeId = sanitizedRegNo.toLowerCase().replace(/[^a-z0-9]/g, "")
    internalEmail = `stu_${safeId}@bloomi.internal`

    const { data: newUserData, error: createError } = await adminClient.auth.admin.createUser({
      email: internalEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        role: "student", // Strictly hardcoded to student
        registration_number: sanitizedRegNo,
        display_name: sanitizedName,
        avatar_id: sanitizedAvatar,
        grade_level: typeof gradeLevel === "number" ? gradeLevel : 3,
      },
    })

    if (createError || !newUserData?.user) {
      console.error("Failed to create student auth user:", createError)
      const errMsg = createError?.message || ""
      if (
        errMsg.toLowerCase().includes("already registered") ||
        errMsg.toLowerCase().includes("already exists") ||
        errMsg.toLowerCase().includes("duplicate")
      ) {
        return new Response(
          JSON.stringify({
            error: "This registration code is already registered. If this is your account, please switch to Sign In with your adventure password.",
          }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      return new Response(
        JSON.stringify({
          error: "Unable to create student account with this registration code. Please verify the code or contact your teacher.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    authUserId = newUserData.user.id

    // Update avatar_id in profiles if needed
    await adminClient
      .from("profiles")
      .update({ avatar_id: sanitizedAvatar })
      .eq("id", authUserId)

    // 7. Atomically enroll student into teacher's classroom (class_students)
    try {
      const { error: enrollErr } = await adminClient.from("class_students").upsert(
        { class_id: matchedClass.id, student_id: authUserId },
        { onConflict: "student_id" }
      )

      if (enrollErr) {
        // Fallback for compound unique constraint (class_id, student_id)
        await adminClient.from("class_students").upsert(
          { class_id: matchedClass.id, student_id: authUserId },
          { onConflict: "class_id,student_id" }
        )
      }
    } catch (enrollErr) {
      console.warn("Class enrollment error during student signup:", enrollErr)
    }

    // 6. Authenticate newly created student via standard Supabase auth
    const { data: authData, error: signInError } = await anonClient.auth.signInWithPassword({
      email: internalEmail,
      password: password,
    })

    if (signInError || !authData.session) {
      console.error("Failed to sign in newly registered student:", signInError)
      return new Response(
        JSON.stringify({
          error: "Account created successfully, but automatic sign-in failed. Please sign in.",
        }),
        { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // 8. Return session and public student profile without leaking private routing email
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
          id: authUserId,
          role: "student",
          displayName: sanitizedName,
          registrationNumber: sanitizedRegNo,
          gradeLevel: typeof gradeLevel === "number" ? gradeLevel : 3,
          avatarId: sanitizedAvatar,
          classId: matchedClass.id,
          className: matchedClass.name,
          classCode: matchedClass.class_code,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (err) {
    console.error("Unhandled error in student-signup Edge Function:", err)
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred during student registration." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
