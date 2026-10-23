import type {
  WorldId,
  InstructionalBand,
  CurriculumWorld,
  CurriculumLevel,
  CurriculumTask,
  TaskType,
  MultipleChoiceTaskData,
  MatchingTaskData,
  OrderingTaskData,
  LetterInputTaskData,
} from '../../types/curriculum.types'
import { skillFrameworkService } from '../../services/skillFramework.service'

// Band categorization helper
export function getBandForLevel(levelNumber: number): {
  band: InstructionalBand
  bandTitle: string
} {
  if (levelNumber <= 10) return { band: 'explore', bandTitle: 'Explore (Levels 1–10)' }
  if (levelNumber <= 20) return { band: 'connect', bandTitle: 'Connect (Levels 11–20)' }
  if (levelNumber <= 30) return { band: 'build', bandTitle: 'Build (Levels 21–30)' }
  if (levelNumber <= 40) return { band: 'apply', bandTitle: 'Apply (Levels 31–40)' }
  return { band: 'master', bandTitle: 'Master & Generalise (Levels 41–50)' }
}

// Level themes & descriptions for Writing World (50 levels)
const writingThemes: { title: string; objective: string }[] = [
  // 1-10: Explore - Letter recognition & formation
  { title: 'Letter Shapes: A, B, C', objective: 'Recognize capital and lowercase forms of A, B, and C.' },
  { title: 'Friendly Curves: D, E, F', objective: 'Identify curves and loops in letters D, E, and F.' },
  { title: 'Straight & Tall: G, H, I', objective: 'Spot tall stems and crossbars in G, H, and I.' },
  { title: 'Hooks & Tails: J, K, L', objective: 'Trace letters with descending hooks and straight lines.' },
  { title: 'Mountain Slopes: M, N, O', objective: 'Follow diagonal strokes and round loops in M, N, O.' },
  { title: 'Round Loops: P, Q, R', objective: 'Distinguish circular top loops in letters P, Q, and R.' },
  { title: 'Wiggles & Crosses: S, T, U', objective: 'Recognize curved paths and horizontal crossbars.' },
  { title: 'Sharp Corners: V, W, X', objective: 'Identify diagonal zigzag strokes in V, W, and X.' },
  { title: 'Branches & Descenders: Y, Z', objective: 'Spot letter stems in Y and horizontal zigzags in Z.' },
  { title: 'Alphabet Garden Review', objective: 'Review and match letters from A to Z across the garden.' },
  // 11-20: Connect - Letter-sound relationships & short CVC words
  { title: 'Short A Word Family', objective: 'Read and assemble short -at and -an family words.' },
  { title: 'Short E Word Family', objective: 'Match sounds and spell short -en and -et family words.' },
  { title: 'Short I Word Family', objective: 'Build short -in and -ip words with friendly letter tiles.' },
  { title: 'Short O Word Family', objective: 'Explore short -ot and -op words in the word garden.' },
  { title: 'Short U Word Family', objective: 'Construct short -un and -ug words with visual hints.' },
  { title: 'Starting Consonants: B, D, M, S', objective: 'Identify beginning consonant sounds in familiar words.' },
  { title: 'Ending Sounds: T, P, G, N', objective: 'Identify ending letter sounds in simple words.' },
  { title: 'Rhyming Word Flowers', objective: 'Connect word pairs that share matching rhyming endings.' },
  { title: '3-Letter Word Assembly', objective: 'Arrange scrambled letters into recognizable 3-letter words.' },
  { title: 'Phonics Sprout Checkpoint', objective: 'Celebrate vowel-consonant combinations and spelling confidence.' },
  // 21-30: Build - Similar-looking letters & blends
  { title: "Teasing 'b' and 'd' Apart", objective: "Use visual direction cues to tell 'b' and 'd' apart." },
  { title: "Teasing 'p' and 'q' Apart", objective: "Spot the tail direction in letters 'p' and 'q'." },
  { title: "Distinguishing 'm' and 'w'", objective: "Observe upward and downward arches in 'm' and 'w'." },
  { title: "Distinguishing 'u' and 'n'", objective: "Recognize open cups in 'u' versus domes in 'n'." },
  { title: "Beginning Blends: 'bl' and 'cl'", objective: "Combine starting consonants into smooth blend sounds." },
  { title: "Beginning Blends: 'sp' and 'st'", objective: "Identify 'sp' and 'st' sounds in everyday objects." },
  { title: "Friendly Digraph: 'sh'", objective: "Recognize the soft 'sh' sound in ship, fish, and shell." },
  { title: "Friendly Digraph: 'ch'", objective: "Identify the perky 'ch' sound in chop, chin, and rich." },
  { title: "Double Vowel Buds: 'ee' and 'oo'", objective: "Read words with double vowels like tree, bee, book, and moon." },
  { title: 'Word Builder Checkpoint', objective: 'Combine blends and digraphs to form strong words.' },
  // 31-40: Apply - Missing letters, spelling & sight words
  { title: 'Core Sight Words: The, And, You', objective: 'Recognize foundational high-frequency Grade 3 sight words.' },
  { title: 'Core Sight Words: They, With, Have', objective: 'Identify and spell useful connecting sight words.' },
  { title: 'Missing Vowel Quest', objective: 'Fill in the correct missing vowel inside word frames.' },
  { title: 'Missing Consonant Quest', objective: 'Select the missing starting or ending consonant.' },
  { title: 'Plural Flowers: Adding -s', objective: 'Transform singular nouns into plurals by adding -s.' },
  { title: 'Plural Flowers: Adding -es', objective: 'Identify words ending in ch, sh, or s that take -es.' },
  { title: 'Action Words with -ing', objective: 'Add -ing to familiar verbs to show ongoing action.' },
  { title: 'Past Words with -ed', objective: 'Add -ed to show actions completed in past moments.' },
  { title: 'Compound Words Adventure', objective: 'Join two smaller words together into one compound word.' },
  { title: 'Word Detective Checkpoint', objective: 'Apply spelling rules and sight word mastery.' },
  // 41-50: Master & Generalise - Sentence building, punctuation & stories
  { title: 'Starting with Capital Letters', objective: 'Identify the capital letter that begins every sentence.' },
  { title: 'Ending Marks: Period (.)', objective: 'Place a clear period at the close of a statement.' },
  { title: 'Ending Marks: Question Mark (?)', objective: 'Recognize questions and add question marks.' },
  { title: 'Expressive Marks: Exclamation (!)', objective: 'Use exclamation points for cheerful announcements.' },
  { title: 'Unscramble: 3-Word Sentences', objective: 'Order subject, verb, and object into a clear sentence.' },
  { title: 'Unscramble: 4-Word Sentences', objective: 'Arrange four word cards into an expressive sentence.' },
  { title: 'Descriptive Words (Adjectives)', objective: 'Enrich simple sentences with colors, shapes, and sizes.' },
  { title: "Connecting Ideas with 'and'", objective: "Link two related thoughts using the connecting word 'and'." },
  { title: 'Story Starter Seed', objective: 'Choose the best opening sentence to start a garden story.' },
  { title: 'Master Author Celebration', objective: 'Demonstrate Grade 3 writing, punctuation, and story craft.' },
]

// Level themes & descriptions for Speaking World (50 levels)
const speakingThemes: { title: string; objective: string }[] = [
  // 1-10: Explore - Listening discrimination
  { title: 'Nature Sounds Discovery', objective: 'Identify rain, wind, stream, and rustling leaves.' },
  { title: 'Animal Voice Calling', objective: 'Match spoken animal sounds to the correct creature.' },
  { title: 'Classroom Clues', objective: 'Distinguish bell rings, pencil writing, and clapping.' },
  { title: 'High vs. Low Sounds', objective: 'Identify pitch differences between bird chirps and drum rumbles.' },
  { title: 'Loud and Gentle Sounds', objective: 'Notice volume variations in voice and instrument sounds.' },
  { title: 'Fast and Slow Rhythms', objective: 'Recognize pacing changes in steady spoken beats.' },
  { title: 'Spoken Tone Explorers', objective: 'Identify cheerful, surprised, and calm voices.' },
  { title: 'Sound Pattern Sequences', objective: 'Remember a 2-sound auditory sequence in order.' },
  { title: 'Whisper and Clear Speech', objective: 'Differentiate whisper volumes from clear speaking voices.' },
  { title: 'Listening Explorer Checkpoint', objective: 'Celebrate keen listening discrimination skills.' },
  // 11-20: Connect - Letter sounds & familiar words
  { title: "The 'S' Snake Sound", objective: "Identify words that start with the hissing 's' sound." },
  { title: "The 'M' Humming Sound", objective: "Hear and identify words starting with the humming 'm' sound." },
  { title: "The 'B' Bouncing Sound", objective: "Spot words with the crisp 'b' sound at the beginning." },
  { title: "The 'T' Ticking Sound", objective: "Hear the rhythmic 't' tap sound in spoken words." },
  { title: 'Long and Short Vowel Sounds', objective: 'Distinguish between short vowel clips and long vowel glides.' },
  { title: 'Rhyme Echo Detective', objective: 'Find spoken words that rhyme with familiar seed words.' },
  { title: 'Syllable Clapping: 1 Beat', objective: 'Recognize single-clap words like cat, dog, and sun.' },
  { title: 'Syllable Clapping: 2 Beats', objective: 'Recognize two-clap words like gar-den and flow-er.' },
  { title: 'First Sound Echo', objective: 'Select the picture matching the first spoken sound heard.' },
  { title: 'Echo Valley Checkpoint', objective: 'Demonstrate sound-to-word matching and phoneme clarity.' },
  // 21-30: Build - Picture naming & syllable beats
  { title: 'Everyday Objects Naming', objective: 'Name and select common household and school items.' },
  { title: 'Classroom Tool Talk', objective: 'Identify crayons, rulers, books, and scissors by sound description.' },
  { title: 'Garden & Food Words', objective: 'Expand expressive vocabulary for fruits, vegetables, and plants.' },
  { title: 'Syllable Beats: 3 Beats', objective: 'Identify 3-clap words like but-ter-fly and el-e-phant.' },
  { title: 'Action Sound Matches', objective: 'Associate words with actions like hopping, running, and singing.' },
  { title: 'Feeling Words Out Loud', objective: 'Connect spoken words to emotions like happy, calm, and eager.' },
  { title: 'Describing What You Hear', objective: 'Choose the best descriptive words for audio descriptions.' },
  { title: 'Sound Associations', objective: 'Match vehicle horn, train whistle, and bicycle bell sounds.' },
  { title: 'Pronunciation Pair Play', objective: 'Hear slight differences between close words like pin and pen.' },
  { title: 'Word Symphony Checkpoint', objective: 'Demonstrate expansive spoken and auditory vocabulary.' },
  // 31-40: Apply - Listening comprehension & clues
  { title: '1-Step Listening Clues', objective: 'Follow a single spoken direction accurately.' },
  { title: '2-Step Listening Clues', objective: 'Listen and follow two sequential auditory steps.' },
  { title: 'Who Am I? Sound Riddle', objective: 'Solve audio riddles based on spoken descriptive clues.' },
  { title: 'Where Am I? Spatial Clues', objective: 'Listen to location phrases like under, beside, and above.' },
  { title: 'Size & Comparison Clues', objective: 'Identify bigger, smaller, longest, or tallest from descriptions.' },
  { title: 'Sequence Listening: First & Then', objective: 'Identify what happened first and what followed.' },
  { title: 'Choose Your Way to Reply', objective: 'Select response options via voice, tap, or AAC visual symbol.' },
  { title: 'Asking to Repeat a Clue', objective: 'Practise polite phrases like "Please say that again".' },
  { title: 'Polite Request Phrases', objective: 'Identify polite spoken requests like "May I please have...".' },
  { title: 'Auditory Explorer Badge', objective: 'Celebrate listening comprehension and multi-modal responses.' },
  // 41-50: Master & Generalise - Expressive sentences & storytelling
  { title: 'Expressing Favorite Choices', objective: 'Formulate sentences about favorite colors, games, and foods.' },
  { title: 'Describing Picture Scenes', objective: 'Describe what is happening in a colorful meadow scene.' },
  { title: 'Retelling 2-Part Stories', objective: 'Retell a simple event with beginning and conclusion.' },
  { title: 'Sharing Opinions Kindly', objective: 'Express agreement or kind preference with sentence frames.' },
  { title: 'Asking a Friend a Question', objective: 'Form polite questions to ask a classmate.' },
  { title: 'Multi-Modal Voice & AAC', objective: 'Switch between spoken phrases and visual AAC board symbols.' },
  { title: 'Echo Story: The Helpful Sprout', objective: 'Follow and complete sentences in an interactive spoken tale.' },
  { title: 'Voice Balloon Journey: Part 1', objective: 'Use voice or tap cues to guide a rising balloon.' },
  { title: 'Voice Balloon Journey: Part 2', objective: 'Complete the balloon journey with expressive sentence choices.' },
  { title: 'Master Communicator Celebration', objective: 'Celebrate full Grade 3 speech and listening mastery.' },
]

// Level themes & descriptions for Visual Discovery (50 levels)
const visualThemes: { title: string; objective: string }[] = [
  // 1-10: Explore - Matching pictures, colors, shapes
  { title: 'Primary Colors Match', objective: 'Match red, blue, and yellow objects with identical colors.' },
  { title: 'Basic Shapes: Circle & Square', objective: 'Distinguish round circles from straight-edged squares.' },
  { title: 'Basic Shapes: Triangle & Star', objective: 'Identify 3-sided triangles and pointed star shapes.' },
  { title: 'Animal Picture Pairs', objective: 'Match pairs of identical animal illustrations.' },
  { title: 'Classroom Object Pairs', objective: 'Match identical pencils, books, and backpacks.' },
  { title: 'Big and Small Size Matching', objective: 'Identify which of two shapes is larger or smaller.' },
  { title: 'Nature Texture Matching', objective: 'Match smooth pebbles, veined leaves, and bark patterns.' },
  { title: 'Outline Silhouette Match', objective: 'Match a colored object to its clean black outline.' },
  { title: 'Shadow Match Detective', objective: 'Find the shape that casts the matching shadow.' },
  { title: 'Visual Meadow Checkpoint', objective: 'Celebrate shape, color, and silhouette visual recognition.' },
  // 11-20: Connect - Patterns and visual sequences
  { title: 'AB Color Patterns', objective: 'Predict the next color in alternating AB sequences.' },
  { title: 'AB Shape Patterns', objective: 'Find the next shape in alternating geometric sequences.' },
  { title: 'AAB Pattern Buds', objective: 'Identify double-repetition AAB patterns like star-star-heart.' },
  { title: 'ABB Pattern Blossoms', objective: 'Identify ABB patterns like flower-leaf-leaf.' },
  { title: 'Size Progression: 3 Steps', objective: 'Arrange objects from smallest to largest.' },
  { title: 'Plant Growth Sequence', objective: 'Order seed, sprout, seedling, and blooming flower.' },
  { title: 'Day to Night Sky Changes', objective: 'Sequence sunrise, bright noon, sunset, and starry night.' },
  { title: 'Missing Pattern Piece', objective: 'Choose the shape that completes an incomplete pattern strip.' },
  { title: 'ABC Repeating Patterns', objective: 'Follow 3-element repeating patterns like circle-triangle-square.' },
  { title: 'Pattern Weaver Checkpoint', objective: 'Demonstrate pattern prediction and visual sequence completion.' },
  // 21-30: Build - Shape & symbol recognition, spatial positions
  { title: 'Position: Inside vs. Outside', objective: 'Identify whether an object is inside or outside a boundary.' },
  { title: 'Position: Above and Below', objective: 'Distinguish items placed above from items placed below.' },
  { title: 'Position: Left and Right', objective: 'Identify shapes located on the left versus right side.' },
  { title: 'Position: Beside & Between', objective: 'Recognize objects positioned in the middle or alongside.' },
  { title: 'Common Signs & Symbols', objective: 'Recognize walk, stop, recycling, and book symbols.' },
  { title: 'Weather Symbol Maps', objective: 'Match sun, raincloud, snowflake, and wind symbols.' },
  { title: 'Part to Whole Match', objective: 'Match a puzzle piece or part to its complete object.' },
  { title: 'Mirror Symmetry Line', objective: 'Find the matching half of a symmetrical butterfly shape.' },
  { title: 'Hidden Shapes in Pictures', objective: 'Spot circles, triangles, and squares inside larger scenes.' },
  { title: 'Spatial Explorer Checkpoint', objective: 'Demonstrate spatial awareness and symbol comprehension.' },
  // 31-40: Apply - Story sequencing & differences
  { title: 'Morning Routine Sequence', objective: 'Order wake up, brush teeth, and eat breakfast.' },
  { title: 'Baking Cake Sequence', objective: 'Order mix ingredients, bake in oven, and decorate.' },
  { title: 'Block Tower Story', objective: 'Order block gathering, careful stacking, and tall tower.' },
  { title: 'Spot the Difference: 1 Detail', objective: 'Find the single detail that differs between two images.' },
  { title: 'Spot the Difference: 2 Details', objective: 'Find two differences between paired illustrations.' },
  { title: 'Odd One Out: Shape Rule', objective: 'Select the item that does not match the category.' },
  { title: 'Odd One Out: Color Rule', objective: 'Spot the shape with an unexpected color.' },
  { title: 'Sorting by Purpose: Toys vs. Tools', objective: 'Sort visual items into toy and tool bins.' },
  { title: 'Visual Memory Peek', objective: 'Recall which item was hidden after a brief look.' },
  { title: 'Visual Detective Checkpoint', objective: 'Apply observational detail and story ordering.' },
  // 41-50: Master & Generalise - Scene comprehension & puzzles
  { title: 'Playground Scene Clues', objective: 'Locate specific children playing on swings, slides, and sand.' },
  { title: 'Garden Meadow Counting', objective: 'Count visual target items hidden across a garden scene.' },
  { title: 'Library Book Sorting', objective: 'Organize visual books by spine height and color theme.' },
  { title: '4-Step Narrative Sequence', objective: 'Order a 4-picture story from start to finish.' },
  { title: 'Matrix Grid Matching', objective: 'Find the matching item that satisfies both row and column.' },
  { title: 'Top vs. Side Perspectives', objective: 'Match an object viewed from above to its side view.' },
  { title: 'Maze & Path Navigation', objective: 'Follow the open path from start to garden fountain.' },
  { title: 'Chart & Icon Reading', objective: 'Read simple visual tally charts with picture icons.' },
  { title: 'The Great Prism Quest', objective: 'Solve multi-layer visual logic and pattern puzzles.' },
  { title: 'Master Visual Explorer', objective: 'Celebrate comprehensive visual cognitive mastery.' },
]

// Level themes & descriptions for Social Adventure (50 levels)
const socialThemes: { title: string; objective: string }[] = [
  // 1-10: Explore - Identifying emotions
  { title: 'Happy & Joyful Moments', objective: 'Recognize smiling expressions, bright energy, and celebration.' },
  { title: 'Calm & Peaceful Feelings', objective: 'Identify steady breathing, quiet posture, and relaxation.' },
  { title: 'Sadness & Gentle Comfort', objective: 'Spot downcast faces and recognize when comforting is helpful.' },
  { title: 'Surprise & Wonder', objective: 'Identify raised eyebrows, round eyes, and unexpected events.' },
  { title: 'Frustration & Big Feelings', objective: 'Recognize furrowed brows and tense hands when things feel hard.' },
  { title: 'Body Clues to Feelings', objective: 'Notice how our shoulders, tummy, and voice reflect emotions.' },
  { title: 'Feelings in Picture Stories', objective: 'Determine how a story character feels based on events.' },
  { title: 'Things That Help You Feel Calm', objective: 'Pick personal calming tools like drawing, quiet, or stretching.' },
  { title: 'All Feelings Are Natural', objective: 'Learn that every emotion is valid and can be shared kindly.' },
  { title: 'Emotion Detective Checkpoint', objective: 'Celebrate emotional awareness and recognizing feelings.' },
  // 11-20: Connect - Greetings & communicative choices
  { title: 'Cheerful Hello Choices', objective: 'Explore saying hi, waving, smiling, or giving a thumbs up.' },
  { title: 'Greeting Familiar Friends', objective: 'Choose a comfortable way to greet a classmate in the morning.' },
  { title: 'Warm Goodbye Choices', objective: 'Explore waving bye, saying "see you tomorrow", or peace signs.' },
  { title: 'Expressing Appreciation', objective: 'Say thank you when someone shares or holds a door.' },
  { title: 'Introducing Yourself Gently', objective: 'Share your name or name badge with a new student.' },
  { title: 'Answering "How Are You?"', objective: 'Respond honestly with happy, tired, calm, or excited.' },
  { title: 'Using Visual AAC to Greet', objective: 'Use symbol cards to share a morning greeting.' },
  { title: 'Listening to a Friend Speak', objective: 'Look toward or focus attention when a friend shares.' },
  { title: 'Respecting Quiet Time', objective: 'Recognize when a friend prefers quiet time over talking.' },
  { title: 'Friendship Sprout Checkpoint', objective: 'Demonstrate varied, comfortable social communication choices.' },
  // 21-30: Build - Asking for help & sensory breaks
  { title: 'Recognizing Overwhelm', objective: 'Notice when noises or tasks feel too loud or crowded.' },
  { title: 'Asking a Teacher for Support', objective: 'Identify phrases and cards for requesting teacher help.' },
  { title: 'Taking a Calming Sensory Break', objective: 'Choose sensory-friendly reset tools like water or quiet.' },
  { title: 'Deep Breaths & Calm Moves', objective: 'Practise steady balloon breathing to soothe the body.' },
  { title: 'Inviting a Friend to Play', objective: 'Ask "Would you like to build blocks with me?" politely.' },
  { title: 'Accepting "No Thanks" Kindly', objective: 'Respect when someone prefers to play alone right now.' },
  { title: 'Personal Preferences Matter', objective: 'Understand that different children like different games.' },
  { title: 'Sharing Supplies Fairly', objective: 'Pass the marker or crayon when a friend asks politely.' },
  { title: 'Taking Turns with Patience', objective: 'Wait for your turn on the swing or favorite game.' },
  { title: 'Self-Advocacy Checkpoint', objective: 'Demonstrate asking for help and taking sensory breaks.' },
  // 31-40: Apply - Boundaries, cooperation & playgrounds
  { title: 'Personal Space Bubbles', objective: 'Understand maintaining an arm-length comfortable space.' },
  { title: 'Asking Before Touching', objective: 'Ask permission before hugging, touching, or borrowing.' },
  { title: 'Playground Kindness Rules', objective: 'Identify safe, friendly behaviors during recess.' },
  { title: 'Waiting in a Classroom Line', objective: 'Keep hands to self and wait steadily for the door.' },
  { title: 'Playing by Game Rules', objective: 'Follow game steps and celebrate everyone taking part.' },
  { title: 'Gracious Winning & Losing', objective: 'Say "Good game!" win or lose with cheerful spirit.' },
  { title: 'Cheering for a Classmate', objective: 'Celebrate when a classmate finishes their drawing or puzzle.' },
  { title: 'Offering a Helping Hand', objective: 'Offer assistance when someone drops pencils or papers.' },
  { title: 'Including a Solitary Friend', objective: 'Invite a classmate sitting alone to join your table.' },
  { title: 'Playground Champion Badge', objective: 'Apply cooperative play and personal boundary awareness.' },
  // 41-50: Master & Generalise - Teamwork & problem solving
  { title: 'Teamwork: Building Together', objective: 'Divide roles when constructing a classroom project.' },
  { title: 'Compromise & Solutions', objective: 'Find a solution both children enjoy when choices differ.' },
  { title: 'Using "I Feel" Statements', objective: 'Communicate feelings clearly without blaming.' },
  { title: 'Forgiving Small Accidents', objective: 'Accept apologies and say "It is okay, let us fix it".' },
  { title: 'Handling Plan Changes', objective: 'Stay calm and adaptable when an activity moves indoors.' },
  { title: 'Encouraging an Anxious Friend', objective: 'Share positive words when someone feels nervous.' },
  { title: 'Being a Supportive Teammate', objective: 'Offer positive feedback during group science or art.' },
  { title: 'Kindness Mission: Part 1', objective: 'Identify acts of kindness across the school day.' },
  { title: 'Kindness Mission: Part 2', objective: 'Solve complex social story scenarios with empathy.' },
  { title: 'Master Kindness Ambassador', objective: 'Celebrate comprehensive social-emotional and empathy mastery.' },
]

// Reusable generator for all 5 tasks within a level
function generateTasksForLevel(
  worldId: WorldId,
  levelNumber: number,
  theme: { title: string; objective: string }
): CurriculumTask[] {
  const levelId = `level_${worldId}_${levelNumber}`
  const bandInfo = getBandForLevel(levelNumber)
  const difficultyLevel =
    bandInfo.band === 'explore'
      ? 1
      : bandInfo.band === 'connect'
      ? 2
      : bandInfo.band === 'build'
      ? 3
      : bandInfo.band === 'apply'
      ? 4
      : 5

  const tasks: CurriculumTask[] = []

  for (let taskNum = 1; taskNum <= 5; taskNum++) {
    const taskId = `task_${worldId}_${levelNumber}_${taskNum}`
    let taskType: TaskType = 'multiple_choice'
    let taskTitle = `Task ${taskNum}: ${theme.title}`
    let data: MultipleChoiceTaskData | MatchingTaskData | OrderingTaskData | LetterInputTaskData

    if (worldId === 'writing') {
      if (taskNum === 1 || taskNum === 5) {
        taskType = 'multiple_choice'
        taskTitle =
          taskNum === 1
            ? `Barnaby's Letter Track: ${theme.title}`
            : `Carnival Marquee Quest: ${theme.title}`

        if (levelNumber <= 10) {
          // Letter Shapes & Orientations
          const letterPairs = [
            { target: 'b', pair: 'd', hint: 'round belly on the right', word: 'balloon' },
            { target: 'd', pair: 'b', hint: 'straight back with round belly on the left', word: 'drum' },
            { target: 'p', pair: 'q', hint: 'stem hanging down with circle on the right', word: 'popcorn' },
            { target: 'm', pair: 'w', hint: 'two arches facing downward', word: 'marquee' },
            { target: 'u', pair: 'n', hint: 'open cup curve facing upward', word: 'umbrella' },
            { target: 's', pair: 'z', hint: 'smooth double curve like a snake', word: 'star' },
            { target: 'c', pair: 'o', hint: 'open circle curve', word: 'carnival' },
            { target: 't', pair: 'f', hint: 'tall line crossed in the middle', word: 'ticket' },
            { target: 'y', pair: 'v', hint: 'tail extending below the baseline', word: 'yellow' },
            { target: 'A', pair: 'a', hint: 'uppercase pointed tent shape', word: 'attraction' },
          ]
          const pair = letterPairs[(levelNumber - 1) % letterPairs.length]

          if (taskNum === 1) {
            data = {
              type: 'multiple_choice',
              question: `Barnaby needs the correct rail piece for the word '${pair.word}'. Which letter has the ${pair.hint}?`,
              options: [
                { id: 'opt_1', text: `Letter '${pair.target}' (${pair.hint})`, isCorrect: true },
                { id: 'opt_2', text: `Letter '${pair.pair}' (faces the opposite direction)`, isCorrect: false },
                { id: 'opt_3', text: `Letter 'x' (crossing diagonal lines)`, isCorrect: false },
              ],
              explanation: `Spot on! Letter '${pair.target}' has the ${pair.hint}, perfectly repairing the coaster track for '${pair.word}'.`,
            }
          } else {
            data = {
              type: 'multiple_choice',
              question: `The carnival marquee reads: 'Welcome to the Big __how!' Which letter completes the word 'Show'?`,
              options: [
                { id: 'opt_1', text: "Letter 'S' (as in Show)", isCorrect: true },
                { id: 'opt_2', text: "Letter 'C' (as in Chow)", isCorrect: false },
                { id: 'opt_3', text: "Letter 'Z' (as in Zhou)", isCorrect: false },
              ],
              explanation: "Hooray! 'S' creates the word 'Show', lighting up the marquee entrance.",
            }
          }
        } else if (levelNumber <= 20) {
          // Phonics & Word Families
          const words = [
            { w: 'cat', f: '-at', rhyme: 'hat', alt: 'cup' },
            { w: 'pen', f: '-en', rhyme: 'hen', alt: 'pot' },
            { w: 'pin', f: '-in', rhyme: 'win', alt: 'pan' },
            { w: 'pot', f: '-ot', rhyme: 'hot', alt: 'pig' },
            { w: 'sun', f: '-un', rhyme: 'run', alt: 'sit' },
            { w: 'bag', f: '-ag', rhyme: 'tag', alt: 'bug' },
            { w: 'red', f: '-ed', rhyme: 'bed', alt: 'rod' },
            { w: 'zip', f: '-ip', rhyme: 'tip', alt: 'zap' },
            { w: 'hop', f: '-op', rhyme: 'top', alt: 'hut' },
            { w: 'tub', f: '-ub', rhyme: 'rub', alt: 'tab' },
          ]
          const item = words[(levelNumber - 11) % words.length]

          data = {
            type: 'multiple_choice',
            question: `Which word shares the same rhyming family ending (${item.f}) with '${item.w}'?`,
            options: [
              { id: 'opt_1', text: `'${item.rhyme}' (rhymes with ${item.w})`, isCorrect: true },
              { id: 'opt_2', text: `'${item.alt}' (different vowel sound)`, isCorrect: false },
              { id: 'opt_3', text: `'car' (unrelated ending)`, isCorrect: false },
            ],
            explanation: `Great listening! '${item.w}' and '${item.rhyme}' both end in '${item.f}'.`,
          }
        } else if (levelNumber <= 30) {
          // Blends & Digraphs
          const blends = [
            { b: 'bl-', ex: 'blue', w: 'blanket', dist: 'fl-' },
            { b: 'cl-', ex: 'clown', w: 'cloud', dist: 'gl-' },
            { b: 'sp-', ex: 'spin', w: 'sparkle', dist: 'st-' },
            { b: 'st-', ex: 'star', w: 'station', dist: 'sp-' },
            { b: 'sh-', ex: 'shine', w: 'shadow', dist: 'ch-' },
            { b: 'ch-', ex: 'cheer', w: 'chocolate', dist: 'sh-' },
            { b: 'th-', ex: 'thrill', w: 'thunder', dist: 'wh-' },
            { b: 'tr-', ex: 'train', w: 'track', dist: 'dr-' },
            { b: 'pl-', ex: 'play', w: 'planet', dist: 'bl-' },
            { b: 'gr-', ex: 'grand', w: 'green', dist: 'cr-' },
          ]
          const blendItem = blends[(levelNumber - 21) % blends.length]

          data = {
            type: 'multiple_choice',
            question: `Which starting blend card unlocks the carnival gate for '${blendItem.w}'?`,
            options: [
              { id: 'opt_1', text: `'${blendItem.b}' (as in ${blendItem.ex} and ${blendItem.w})`, isCorrect: true },
              { id: 'opt_2', text: `'${blendItem.dist}' (different consonant blend)`, isCorrect: false },
              { id: 'opt_3', text: `'pr-' (unrelated sound)`, isCorrect: false },
            ],
            explanation: `Super decoding! '${blendItem.b}' blends smoothly to start '${blendItem.w}'.`,
          }
        } else {
          // Sight Words, Grammar & Sentence Comprehension
          data = {
            type: 'multiple_choice',
            question: `Read the carnival guide: 'Barnaby and his friends ___ laughing on the roller coaster.' Which verb fits best?`,
            options: [
              { id: 'opt_1', text: 'were (plural past tense for friends)', isCorrect: true },
              { id: 'opt_2', text: 'was (singular only)', isCorrect: false },
              { id: 'opt_3', text: 'is (present singular)', isCorrect: false },
            ],
            explanation: "Grammar champion! 'Friends' is plural, so 'were laughing' completes the sentence accurately.",
          }
        }
      } else if (taskNum === 2) {
        taskType = 'matching'
        taskTitle = `Ferris Wheel Sound Match: ${theme.title}`

        if (levelNumber <= 15) {
          data = {
            type: 'matching',
            prompt: 'Match each uppercase carnival letter with its lowercase partner:',
            pairs: [
              { id: 'pair_1', left: "Uppercase 'B'", right: "Lowercase 'b'" },
              { id: 'pair_2', left: "Uppercase 'D'", right: "Lowercase 'd'" },
            ],
          }
        } else if (levelNumber <= 30) {
          data = {
            type: 'matching',
            prompt: 'Match each consonant blend with the carnival word it starts:',
            pairs: [
              { id: 'pair_1', left: "Blend 'st-'", right: "Word: 'star'" },
              { id: 'pair_2', left: "Blend 'tr-'", right: "Word: 'track'" },
            ],
          }
        } else {
          data = {
            type: 'matching',
            prompt: 'Match each carnival word with its describing partner:',
            pairs: [
              { id: 'pair_1', left: 'Glowing carnival lanterns', right: 'Bright illumination' },
              { id: 'pair_2', left: 'Speedy wooden coaster', right: 'Rapid thrilling ride' },
            ],
          }
        }
      } else if (taskNum === 3) {
        taskType = 'ordering'
        taskTitle = `Carnival Word Train: ${theme.title}`

        if (levelNumber <= 20) {
          data = {
            type: 'ordering',
            prompt: "Arrange the letter train cars in correct order to spell 'CAR':",
            items: [
              { id: 'item_1', text: "Letter 'C'", correctOrder: 1 },
              { id: 'item_2', text: "Letter 'A'", correctOrder: 2 },
              { id: 'item_3', text: "Letter 'R'", correctOrder: 3 },
            ],
          }
        } else if (levelNumber <= 35) {
          data = {
            type: 'ordering',
            prompt: "Arrange the letter cars in order to spell 'RIDE':",
            items: [
              { id: 'item_1', text: "R (first sound)", correctOrder: 1 },
              { id: 'item_2', text: "I (long vowel)", correctOrder: 2 },
              { id: 'item_3', text: "D (consonant)", correctOrder: 3 },
            ],
          }
        } else {
          data = {
            type: 'ordering',
            prompt: 'Arrange the word cars to build a complete sentence:',
            items: [
              { id: 'item_1', text: '1. The festive carousel', correctOrder: 1 },
              { id: 'item_2', text: '2. spins cheerfully', correctOrder: 2 },
              { id: 'item_3', text: '3. under twinkling lights.', correctOrder: 3 },
            ],
          }
        }
      } else {
        taskType = 'letter_input'
        taskTitle = `Ticket Booth Letter Forge: ${theme.title}`

        const blanks = [
          { prompt: "Type the missing vowel for Barnaby's ticket: c_t (a small pet)", blank: 'c_t', exp: 'a', alts: ['A'] },
          { prompt: "Type the missing vowel for the park map: b_d (where you sleep)", blank: 'b_d', exp: 'e', alts: ['E'] },
          { prompt: "Type the missing vowel for the coaster: r_de (roller coaster fun)", blank: 'r_de', exp: 'i', alts: ['I'] },
          { prompt: "Type the missing vowel for the carnival prize: st_r (glowing in sky)", blank: 'st_r', exp: 'a', alts: ['A'] },
          { prompt: "Type the missing vowel for daytime: s_n (shines bright)", blank: 's_n', exp: 'u', alts: ['U'] },
        ]
        const blankItem = blanks[(levelNumber - 1) % blanks.length]

        data = {
          type: 'letter_input',
          prompt: blankItem.prompt,
          wordWithBlank: blankItem.blank,
          expectedLetter: blankItem.exp,
          acceptableAlternatives: blankItem.alts,
        }
      }
    } else if (worldId === 'speaking') {
      if (taskNum === 2 || taskNum === 4) {
        taskType = 'matching'
        taskTitle =
          taskNum === 2
            ? `Chef Pip's Recipe Sounds: ${theme.title}`
            : `AAC Kitchen Picture Board: ${theme.title}`

        if (taskNum === 2) {
          data = {
            type: 'matching',
            prompt: 'Match each magical kitchen action with the sound it makes:',
            pairs: [
              { id: 'pair_1', left: 'Whisking fluffy batter in bowl', right: 'Soft gentle swirling sound' },
              { id: 'pair_2', left: 'Chopping fresh crisp apples', right: 'Crisp rhythmic tap on cutting board' },
            ],
          }
        } else {
          data = {
            type: 'matching',
            prompt: 'Match each picture communication card with what you need:',
            pairs: [
              { id: 'pair_1', left: 'Picture Card: "More Honey Please"', right: 'Add golden sweetness to bowl' },
              { id: 'pair_2', left: 'Picture Card: "Timer Finished"', right: 'Take golden baked bread from oven' },
            ],
          }
        }
      } else if (taskNum === 3) {
        taskType = 'ordering'
        taskTitle = `Recipe Step Sequencing: ${theme.title}`
        data = {
          type: 'ordering',
          prompt: 'Arrange the baking recipe steps in chronological order:',
          items: [
            { id: 'item_1', text: 'Step 1: Rinse fresh berries and measure oat flour', correctOrder: 1 },
            { id: 'item_2', text: 'Step 2: Stir ingredients gently in the mixing bowl', correctOrder: 2 },
            { id: 'item_3', text: 'Step 3: Bake in the magic oven until fragrant and warm', correctOrder: 3 },
          ],
        }
      } else {
        taskType = 'multiple_choice'
        taskTitle = `Magical Cafe Order: ${theme.title}`
        data = {
          type: 'multiple_choice',
          question: `Customer Panda orders: 'One warm cinnamon roll with cold apple cider, please.' What did they order?`,
          options: [
            { id: 'opt_1', text: 'Warm cinnamon roll & cold apple cider', isCorrect: true },
            { id: 'opt_2', text: 'Spicy pepper soup with green tea', isCorrect: false },
            { id: 'opt_3', text: 'Crunchy potato chips with water', isCorrect: false },
          ],
          explanation: "Splendid listening! You matched the customer's exact bakery order.",
        }
      }
    } else if (worldId === 'visual') {
      if (taskNum === 1 || taskNum === 3) {
        taskType = 'matching'
        taskTitle =
          taskNum === 1
            ? `Nova's Constellation Match: ${theme.title}`
            : `Space Station Visual Matrix: ${theme.title}`

        if (taskNum === 1) {
          data = {
            type: 'matching',
            prompt: 'Match each star constellation with its cosmic shape:',
            pairs: [
              { id: 'pair_1', left: 'Ursa Major (Big Bear)', right: 'Seven stars forming a bright ladle' },
              { id: 'pair_2', left: 'Cassiopeia (Star Crown)', right: 'Five stars forming a wide W in the sky' },
            ],
          }
        } else {
          data = {
            type: 'matching',
            prompt: 'Match each satellite module with its spatial position on the station:',
            pairs: [
              { id: 'pair_1', left: 'Top Solar Array Panel', right: 'Facing direct starlight above' },
              { id: 'pair_2', left: 'Lower Observation Cupola', right: 'Looking down toward planetary rings' },
            ],
          }
        }
      } else if (taskNum === 2) {
        taskType = 'ordering'
        taskTitle = `Planet Mission Orbit Sequence: ${theme.title}`
        data = {
          type: 'ordering',
          prompt: 'Arrange the planetary space mission stages in order:',
          items: [
            { id: 'item_1', text: 'Stage 1: Launch rocket from space station pad', correctOrder: 1 },
            { id: 'item_2', text: 'Stage 2: Enter smooth orbit around Lunar Base', correctOrder: 2 },
            { id: 'item_3', text: 'Stage 3: Touch down softly on Mars research crater', correctOrder: 3 },
          ],
        }
      } else {
        taskType = 'multiple_choice'
        taskTitle = `Alien Guide Telescope Quest: ${theme.title}`
        data = {
          type: 'multiple_choice',
          question: 'Look at Nova\'s repeating star pattern: Gold Star ➔ Blue Moon ➔ Gold Star ➔ Blue Moon ➔ ____. Which tile comes next?',
          options: [
            { id: 'opt_1', text: 'Gold Star (completes the repeating AB pattern)', isCorrect: true },
            { id: 'opt_2', text: 'Green Comet (not part of the sequence)', isCorrect: false },
            { id: 'opt_3', text: 'Purple Planet (wrong color and shape)', isCorrect: false },
          ],
          explanation: 'Sharp detective eye! Following the alternating pattern, Gold Star comes next.',
        }
      }
    } else {
      // Social Adventure (Magic Animal World)
      if (taskNum === 2) {
        taskType = 'matching'
        taskTitle = `Sanctuary Kindness Pairs: ${theme.title}`
        data = {
          type: 'matching',
          prompt: 'Match each sanctuary friend feeling with a kind, caring response:',
          pairs: [
            { id: 'pair_1', left: 'Friend feeling tired or crowded by noise', right: 'Offer headphones or quiet space' },
            { id: 'pair_2', left: 'Friend excited about a finished drawing', right: 'Cheer and celebrate their effort' },
          ],
        }
      } else if (taskNum === 4) {
        taskType = 'ordering'
        taskTitle = `Cooperative Play Sequence: ${theme.title}`
        data = {
          type: 'ordering',
          prompt: 'Arrange the steps for playing collaboratively in sequence:',
          items: [
            { id: 'item_1', text: '1. Walk over and ask politely: "May I build with blocks too?"', correctOrder: 1 },
            { id: 'item_2', text: '2. Listen with care and respect to their answer', correctOrder: 2 },
            { id: 'item_3', text: '3. Take turns adding blocks gently to the shared tower', correctOrder: 3 },
          ],
        }
      } else {
        taskType = 'multiple_choice'
        taskTitle = `Koa's Empathy Mission: ${theme.title}`
        data = {
          type: 'multiple_choice',
          question: 'Koa notices that the school cafeteria has gotten very noisy, and a friend looks overwhelmed and covers their ears. What is a helpful, supportive choice?',
          options: [
            { id: 'opt_1', text: 'Offer noise-cancelling headphones or ask if they want to sit in the quiet corner', isCorrect: true },
            { id: 'opt_2', text: 'Shout louder next to them so they can hear you', isCorrect: false },
            { id: 'opt_3', text: 'Tease them for covering their ears', isCorrect: false },
          ],
          explanation: 'Heartwarming empathy! Offering headphones or a quiet spot respects their sensory comfort.',
        }
      }
    }

    const worldSkillMap: Record<WorldId, { domain: string; companion: string; methodList: string[] }> = {
      writing: {
        domain: 'Writing & Expression',
        companion: 'Barnaby the Carnival Bear',
        methodList: ['Touch Tap', 'Letter Placement', 'Word Ordering', 'Spoken Clue'],
      },
      speaking: {
        domain: 'Communication & Food Discovery',
        companion: 'Pip the Baker Bunny',
        methodList: ['Picture Selection', 'Recipe Ordering', 'Audio Clue', 'AAC Card'],
      },
      visual: {
        domain: 'Visual Discovery & Space',
        companion: 'Nova the Star Fox',
        methodList: ['Pattern Tap', 'Sequence Ordering', 'Visual Grid', 'High-Contrast View'],
      },
      social: {
        domain: 'Social Understanding & Animals',
        companion: 'Koa the Explorer Panda',
        methodList: ['Emotion Card', 'Scenario Matching', 'Visual Empathy Cue', 'AAC Reset'],
      },
    }

    const worldSkill = worldSkillMap[worldId]
    const targetSkillId = skillFrameworkService.inferSkillFromTask(worldId, levelNumber, taskType)

    tasks.push({
      id: taskId,
      levelId,
      taskNumber: taskNum,
      title: taskTitle,
      instruction: `Explore step ${taskNum} of 5: ${theme.objective}`,
      taskType,
      data,
      targetSkillId,
      skillDifficulty: difficultyLevel,
      hint: `Hint for Level ${levelNumber}, Task ${taskNum}: Take your time! Tap, listen, or think about ${theme.objective.toLowerCase()}`,
      visualDemonstration: `Look closely at the clues for ${theme.title}. Choose the option that fits best!`,
      spokenInstruction: `Step ${taskNum}. ${theme.objective}. Take your time and tap your answer when you are ready.`,
      audioPromptText: `${taskTitle}. ${theme.objective}. Take your time.`,
      pictureChoiceSupported: true,
      aacStyleSupported: worldId === 'social' || worldId === 'speaking',
      scoringRubric:
        'Full mastery awarded for independently matching or ordering target educational criteria. Multiple retries permitted without penalty.',
      supportedResponseMethods: worldSkill.methodList,
      skillsPracticed: [worldSkill.domain, 'Everyday Learning Focus'],
      encouragementTip: `${worldSkill.companion} says: You are doing great exploring this level!`,
      accommodationsAvailable: [
        'Read-Aloud TTS with replay',
        'Untimed practice & breaks',
        'Calm sensory mode with reduced motion',
        'Visual demonstration cards',
        'Picture-supported choices (AAC)',
        'Zero forced speech or eye contact',
      ],
    })
  }

  return tasks
}

// Generate all 50 levels for a specific world
function generateLevelsForWorld(
  worldId: WorldId,
  themes: { title: string; objective: string }[]
): CurriculumLevel[] {
  return themes.map((theme, index) => {
    const levelNumber = index + 1
    const { band, bandTitle } = getBandForLevel(levelNumber)
    const levelId = `level_${worldId}_${levelNumber}`

    return {
      id: levelId,
      worldId,
      levelNumber,
      band,
      bandTitle,
      title: theme.title,
      objective: theme.objective,
      tasks: generateTasksForLevel(worldId, levelNumber, theme),
      completionRule: { type: 'all_tasks_completed' },
    }
  })
}

// Build all 4 worlds with 50 levels each (Total 200 levels, 1,000 tasks)
export const curriculumWorlds: Record<WorldId, CurriculumWorld> = {
  writing: {
    id: 'writing',
    title: 'Magic Amusement Park',
    subtitle: 'Carnival Quests & Story Rollercoasters',
    description: 'Letters, handwriting, spelling, carnival banners, and sentence creation.',
    accentColor: 'from-[#FFE0CC] to-[#FFCFB0]',
    bgLight: 'bg-[#FFF9F5]',
    borderColor: 'border-[#F8D2B8]',
    magicalWorldName: 'Magic Amusement Park',
    sceneTheme: 'amusement_park',
    companionName: 'Barnaby the Carnival Bear',
    skillDomains: ['Writing', 'Communication', 'Visual Discovery', 'Social Understanding'],
    supportedResponseMethods: ['Touch Tap', 'Letter Placement', 'Word Ordering', 'Spoken Clue'],
    levels: generateLevelsForWorld('writing', writingThemes),
  },
  speaking: {
    id: 'speaking',
    title: 'Magic Food World',
    subtitle: 'Chef Kitchen & Recipe Bakery',
    description: 'Cooking clues, recipe ordering, food vocabulary, and expressive listening.',
    accentColor: 'from-[#E8DEFF] to-[#D5C2FE]',
    bgLight: 'bg-[#F9F6FF]',
    borderColor: 'border-[#D5C2FE]',
    magicalWorldName: 'Magic Food World',
    sceneTheme: 'food_world',
    companionName: 'Pip the Baker Bunny',
    skillDomains: ['Communication', 'Writing', 'Social Understanding', 'Visual Discovery'],
    supportedResponseMethods: ['Picture Selection', 'Recipe Ordering', 'Audio Clue', 'AAC Card'],
    levels: generateLevelsForWorld('speaking', speakingThemes),
  },
  visual: {
    id: 'visual',
    title: 'Magic Space World',
    subtitle: 'Cosmic Observatory & Rocket Paths',
    description: 'Constellation matching, rocket patterns, spatial reasoning, and cosmic sequences.',
    accentColor: 'from-[#CDEFE0] to-[#B2E6CE]',
    bgLight: 'bg-[#F2FAF6]',
    borderColor: 'border-[#B2E6CE]',
    magicalWorldName: 'Magic Space World',
    sceneTheme: 'space_world',
    companionName: 'Nova the Star Fox',
    skillDomains: ['Visual Discovery', 'Social Understanding', 'Writing', 'Communication'],
    supportedResponseMethods: ['Pattern Tap', 'Sequence Ordering', 'Visual Grid', 'High-Contrast View'],
    levels: generateLevelsForWorld('visual', visualThemes),
  },
  social: {
    id: 'social',
    title: 'Magic Animal World',
    subtitle: 'Safari Habitats & Creature Friends',
    description: 'Animal emotions, safari communication choices, team cooperation, and kindness.',
    accentColor: 'from-[#FFF0B3] to-[#FDE58A]',
    bgLight: 'bg-[#FFFDF0]',
    borderColor: 'border-[#FCE58D]',
    magicalWorldName: 'Magic Animal World',
    sceneTheme: 'animal_world',
    companionName: 'Koa the Explorer Panda',
    skillDomains: ['Social Understanding', 'Communication', 'Writing', 'Visual Discovery'],
    supportedResponseMethods: ['Emotion Card', 'Scenario Matching', 'Visual Empathy Cue'],
    levels: generateLevelsForWorld('social', socialThemes),
  },
}

// Helper methods
export const curriculumService = {
  getAllWorlds(): CurriculumWorld[] {
    return Object.values(curriculumWorlds)
  },

  getWorld(worldId: WorldId): CurriculumWorld {
    return curriculumWorlds[worldId]
  },

  getLevel(worldId: WorldId, levelNumber: number): CurriculumLevel | undefined {
    return curriculumWorlds[worldId]?.levels.find((l) => l.levelNumber === levelNumber)
  },

  getTotalLevelCount(): number {
    return Object.values(curriculumWorlds).reduce((acc, w) => acc + w.levels.length, 0)
  },

  getTotalTaskCount(): number {
    return Object.values(curriculumWorlds).reduce(
      (acc, w) => acc + w.levels.reduce((lAcc, l) => lAcc + l.tasks.length, 0),
      0
    )
  },
}
