
export type UserType = 'sparky' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  createdAt: string;
}

export interface SparkyProfile extends User {
  aboutMe: string;
  contactEmail: string;
  phone?: string;
  avatarUrl: string;
  githubUrl: string;
  portfolioUrl?: string;
  skills: Skill[];
  credits: number;
  sessionsCompleted: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  ratings: number;
  sessions: number;
}

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  requirements: string[];
  budget: number;
  deadline: string;
  status: 'open' | 'assigned' | 'completed' | 'canceled';
  createdAt: string;
  bids: Bid[];
  assignedSparkyId?: string;
}

export interface Bid {
  id: string;
  projectId: string;
  sparkyId: string;
  sparkyName: string;
  sparkyAvatar: string;
  sparkyRating: number;
  amount: number;
  proposal: string;
  estimatedDuration: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}
