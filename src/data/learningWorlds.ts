import type { LearningWorld } from '../types'

export const learningWorlds: LearningWorld[] = [
  {
    id: 'writing',
    title: 'Writing World',
    subtitle: 'Word Garden of Wonders',
    description:
      'Explore letters, handwriting, spelling, and sentences with gentle visual guides and playful word tiles.',
    badge: 'Letters & Handwriting',
    accentColor: 'from-[#FFE0CC] to-[#FFCFB0]',
    bgLight: 'bg-[#FFF9F5]',
    borderColor: 'border-[#F8D2B8]',
    iconName: 'PenTool',
    targetSkills: ['Letter Tracing', 'Spelling Roots', 'Sentence Building', 'Creative Stories'],
    sampleActivities: ['Magic Letter Tracing', 'Word Sprout Puzzles', 'Picture Sentence Maker'],
  },
  {
    id: 'speaking',
    title: 'Speaking World',
    subtitle: 'Echo Valley of Voices',
    description:
      'Practise listening, sound games, clear words, and optional voice adventures with multi-modal picture support.',
    badge: 'Listening & Sounds',
    accentColor: 'from-[#E8DEFF] to-[#D5C2FE]',
    bgLight: 'bg-[#F9F6FF]',
    borderColor: 'border-[#D9C8FB]',
    iconName: 'Mic',
    targetSkills: ['Sound Recognition', 'Word Pronunciation', 'Listening Clues', 'AAC Voice Cues'],
    sampleActivities: ['Echo Rhyme Cave', 'Voice Balloon Lift', 'Sound Match Detective'],
  },
  {
    id: 'visual',
    title: 'Visual Discovery',
    subtitle: 'Prism Meadow Explorer',
    description:
      'Strengthen visual matching, colourful patterns, sequences, and picture puzzles designed for every learning style.',
    badge: 'Patterns & Matching',
    accentColor: 'from-[#CDEFE0] to-[#B2E6CE]',
    bgLight: 'bg-[#F2FAF6]',
    borderColor: 'border-[#B2E6CE]',
    iconName: 'Eye',
    targetSkills: ['Pattern Matching', 'Visual Sequences', 'Shape Recognition', 'Spatial Puzzles'],
    sampleActivities: ['Hidden Picture Quest', 'Symbol Pattern Journey', 'Color Prism Match'],
  },
  {
    id: 'social',
    title: 'Social Adventure',
    subtitle: 'Kindness Kingdom',
    description:
      'Discover emotions, friendly communication choices, cooperation, and everyday classroom social stories.',
    badge: 'Empathy & Cooperation',
    accentColor: 'from-[#FFF0B3] to-[#FDE58A]',
    bgLight: 'bg-[#FFFDF0]',
    borderColor: 'border-[#FCE58D]',
    iconName: 'HeartHandshake',
    targetSkills: ['Emotion Clues', 'Friendly Sharing', 'Everyday Scenarios', 'Team Cooperation'],
    sampleActivities: ['Feelings Detective', 'Playground Friends Mission', 'Kindness Star Tree'],
  },
]
