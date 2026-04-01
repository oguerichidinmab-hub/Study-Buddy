export interface PracticeGoal {
  subject: string;
  targetQuizzes: number;
  targetScore: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  educationLevel: 'Secondary' | 'University';
  targetExams: string[];
  strengths: string[];
  weaknesses: string[];
  availableHours: number;
  buddyType: 'AI' | 'Contact' | 'Guardian' | 'AppUser';
  buddyName?: string;
  buddyId?: string;
  buddyRating?: number;
  buddyAlwaysPicksCalls?: boolean;
  buddyCaresAboutStudies?: boolean;
  subjects: string[];
  practiceGoals?: PracticeGoal[];
  studyStartTime?: string;
  studyEndTime?: string;
  achievements: Achievement[];
  createdAt: string;
  points: number;
  rank: number;
  friends: Friend[];
  groups: string[]; // Group IDs
  dailyGoals: DailyGoal[];
  notifications: Notification[];
  studyTips: StudyTip[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  progress: number;
  target: number;
}

export interface Friend {
  uid: string;
  displayName: string;
  status: 'online' | 'offline' | 'studying';
  points: number;
  avatar?: string;
}

export interface DailyGoal {
  id: string;
  title: string;
  completed: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'quiz' | 'challenge' | 'result' | 'general';
  timestamp: string;
  read: boolean;
}

export interface StudyTip {
  id: string;
  tip: string;
  completed: boolean;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  icon: string;
  joined: boolean;
}

export interface ScheduleBlock {
  startTime: string;
  endTime: string;
  subject: string;
  type: 'Study' | 'Break' | 'Rest';
  completed: boolean;
}

export interface Schedule {
  id?: string;
  userId: string;
  date: string;
  blocks: ScheduleBlock[];
}

export interface StudySession {
  id?: string;
  userId: string;
  subject: string;
  durationMinutes: number;
  startTime: string;
  endTime?: string;
  buddyId?: string;
}

export interface ExamQuestion {
  id: string;
  subject: string;
  year?: number;
  examType: 'JAMB' | 'WAEC' | 'NECO' | 'POST-UTME' | 'General';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  sourceType: 'original' | 'licensed' | 'user_uploaded';
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizResult {
  id?: string;
  userId: string;
  subject: string;
  examType?: string;
  score: number;
  totalQuestions: number;
  date: string;
}
