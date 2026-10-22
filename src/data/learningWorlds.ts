import type { LearningWorld } from '../types'

export const learningWorlds: LearningWorld[] = [
  {
    id: 'writing',
    title: 'Writing World',
    subtitle: 'Word Garden of Wonders',
    description:
      'Practice letter shapes, build sentences with drag-and-drop tiles, and write imaginative stories with friendly visual word prompts.',
    badge: 'Literacy & Phonics',
    accentColor: 'from-amber-400 to-orange-500',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-300',
    iconName: 'PenTool',
    targetSkills: ['Sentence Structure', 'Phonics Mastery', 'Creative Writing', 'Vocabulary Sprouting'],
    sampleActivities: ['Magic Letter Tracing', 'Sentence Garden Puzzle', 'Story Maker with Pictures'],
  },
  {
    id: 'speaking',
    title: 'Speaking World',
    subtitle: 'Echo Valley of Voices',
    description:
      'Express ideas clearly, practice cheerful pronunciation games, voice stories, and communicate using multimodal voice & AAC cues.',
    badge: 'Speech & Communication',
    accentColor: 'from-sky-400 to-blue-600',
    bgLight: 'bg-sky-50',
    borderColor: 'border-sky-300',
    iconName: 'Mic',
    targetSkills: ['Expressive Speech', 'Listening & Clarity', 'Pronunciation Fun', 'Multimodal AAC Support'],
    sampleActivities: ['Echo Rhyme Cave', 'Voice Balloon Lift', 'Show & Tell Companion'],
  },
  {
    id: 'visual',
    title: 'Visual Discovery',
    subtitle: 'Prism Meadow Explorer',
    description:
      'Strengthen visual memory, match symbols to concepts, solve spatial puzzles, and explore rich visual cues crafted for all learning styles.',
    badge: 'Visual Literacy & Cognition',
    accentColor: 'from-emerald-400 to-teal-600',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    iconName: 'Eye',
    targetSkills: ['Visual Memory', 'Symbol Recognition', 'Spatial Reasoning', 'Pattern Discovery'],
    sampleActivities: ['Hidden Picture Quest', 'Symbol-to-Word Match', 'Color Spectrum Journey'],
  },
  {
    id: 'social',
    title: 'Social Adventure',
    subtitle: 'Kindness Kingdom',
    description:
      'Explore feelings with interactive emotion detectives, practice empathy scenarios, turn-taking, and celebrate collaborative classroom missions.',
    badge: 'Social-Emotional Learning',
    accentColor: 'from-purple-400 to-pink-500',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-300',
    iconName: 'HeartHandshake',
    targetSkills: ['Emotion Recognition', 'Empathy & Sharing', 'Collaborative Play', 'Perspective Taking'],
    sampleActivities: ['Feelings Detective', 'Playground Friends Mission', 'Kindness Tree of Stars'],
  },
]
