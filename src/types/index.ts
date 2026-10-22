export type UserRole = 'student' | 'teacher' | 'parent';

export type WorldId = 'writing' | 'speaking' | 'visual' | 'social';

export interface LearningWorld {
  id: WorldId;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  accentColor: string;
  bgLight: string;
  borderColor: string;
  iconName: string;
  targetSkills: string[];
  sampleActivities: string[];
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeFont: boolean;
  reducedMotion: boolean;
  readAloudEnabled: boolean;
}
