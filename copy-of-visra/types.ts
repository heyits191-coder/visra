
export type Theme = 'light' | 'dark' | 'system';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  mask?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
}

export interface PendingEdit {
  image: string;
  mask: string;
}

export interface ToastType {
  message: string;
  id: number;
}
