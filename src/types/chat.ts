export type MessageRole = 'user' | 'assistant' | 'system';

export type Mode = 'chat' | 'code' | 'research';

export interface Message {
  _id?: string;
  role: MessageRole;
  content: string;
  reasoning?: string;
  model?: string;
  createdAt?: Date;
}

export interface Chat {
  _id: string;
  userId: string;
  title: string;
  messages: Message[];
  mode: Mode;
  aiModel: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateChatParams {
  title?: string;
  mode?: Mode;
  aiModel?: string;
}

export interface UpdateChatParams {
  title?: string;
  pinned?: boolean;
}
