export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  audioBase64?: string | null;
  timestamp: string;
}

export interface ConversationExchange {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  audioBase64?: string | null;
}

export type MilestoneCategory = 'craft' | 'installation' | 'wellness' | 'education' | 'military';

export interface CareerMilestone {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  category: MilestoneCategory;
  summary: string;
  bullets: string[];
  keyHighlight?: string;
  badge?: string;
}

export interface VerifiedCredential {
  title: string;
  issuer: string;
  year: string;
  description: string;
  code?: string;
}

export interface PromptStarter {
  label: string;
  query: string;
  tag: string;
}
