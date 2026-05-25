export type MessageRole = 'user' | 'assistant' | 'system';

export type Mode = 'chat' | 'code' | 'research';

export type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

export interface Message {
  _id?: string;
  role: MessageRole;
  content: string | ContentPart[];
  reasoning?: string;
  model?: string;
  createdAt?: Date;
  branchId?: string;
  parentMessageIndex?: number;
}

export interface Chat {
  _id: string;
  userId: string;
  title: string;
  messages: Message[];
  mode: Mode;
  aiModel: string;
  pinned: boolean;
  branches: Record<string, Message[]>;
  activeBranchId: string;
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
