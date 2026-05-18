export type UserType = 'sparky' | 'client';

export interface SkillEntry {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  category: string;
  sessionLength: number;
  creditsPerSession: number;
  isRemote: boolean;
  isGroup: boolean;
  ratings: number;
  sessions: number;
  isActive: boolean;
  createdAt?: string;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  type: UserType;
  credits: number;
  isOnboarded: boolean;
  aboutMe?: string;
  contactEmail?: string;
  phone?: string;
  avatarUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  skills?: SkillEntry[];
  sessionsCompleted?: number;
  totalEarnings?: number;
  overallRating?: number;
  totalReviews?: number;
  interests?: string[];
  totalSpent?: number;
  createdAt?: string;
}

export interface SparkyProfile extends User {
  skills: SkillEntry[];
  sessionsCompleted: number;
  totalEarnings: number;
  overallRating: number;
}

export interface Bid {
  id?: string;
  _id?: string;
  projectId?: string;
  sparkyId: string;
  sparkyName: string;
  sparkyAvatar?: string;
  sparkyRating?: number;
  amount: number;
  proposal: string;
  estimatedDuration: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt?: string;
}

export interface Project {
  id?: string;
  _id?: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  requirements: string[];
  budget: number;
  deadline: string;
  status: 'open' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  assignedSparkyId?: string | null;
  bids: Bid[];
  category?: string;
  createdAt?: string;
}

export interface SessionItem {
  id?: string;
  _id?: string;
  clientId?: string;
  sparkyId: string;
  sparkyName: string;
  sparkyAvatar?: string;
  title: string;
  skillName?: string;
  scheduledAt: string;
  date?: string;
  duration?: number;
  credits: number;
  status: 'upcoming' | 'completed' | 'cancelled' | 'rescheduled';
  meetingLink?: string;
  clientReview?: { rating?: number; comment?: string };
  createdAt?: string;
}

export interface Campaign {
  id?: string;
  _id?: string;
  creatorId: string;
  creatorName: string;
  creatorType: UserType;
  title: string;
  description: string;
  goal: number;
  raised: number;
  backers: { userId?: string; amount: number; donatedAt?: string }[];
  endsAt: string;
  daysLeft?: number;
  progressPercent?: number;
  imageUrl?: string;
  visibility?: 'public' | 'private';
  status: 'active' | 'funded' | 'expired' | 'cancelled';
  category?: string;
  createdAt?: string;
}

export interface Resource {
  id?: string;
  _id?: string;
  title: string;
  type: 'article' | 'video' | 'interactive';
  category: string;
  author: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  readTime?: number;
  duration?: number;
  isFeatured?: boolean;
  tags?: string[];
  views?: number;
  saves?: string[];
  createdAt?: string;
}

export interface Mentor {
  id?: string;
  _id?: string;
  name: string;
  title: string;
  bio?: string;
  experience: string;
  specialties: string[];
  creditsPerSession: number;
  availability: string;
  avatarUrl?: string;
  rating?: number;
  totalSessions?: number;
  tags?: string[];
}

export interface AISkillSuggestion {
  name: string;
  reason: string;
  creditsPerSession: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface LearningPathStep {
  stepNumber: number;
  title: string;
  description: string;
  estimatedDuration: string;
  resources: string[];
}
