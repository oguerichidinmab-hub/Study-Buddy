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
  studyStartTime?: string;
  studyEndTime?: string;
  achievements: string[];
  createdAt: string;
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

export interface QuizResult {
  id?: string;
  userId: string;
  subject: string;
  score: number;
  totalQuestions: number;
  date: string;
}
