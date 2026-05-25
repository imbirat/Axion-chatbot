import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoning?: string;
  model?: string;
  createdAt?: Date;
  branchId?: string;
  parentMessageIndex?: number;
}

export interface IReaction {
  messageIndex: number;
  reaction: 'up' | 'down';
  createdAt: Date;
}

export interface IChat extends Document {
  userId: string;
  title: string;
  messages: IMessage[];
  mode: 'chat' | 'code' | 'research';
  aiModel: string;
  pinned: boolean;
  branches: Record<string, any[]>;
  activeBranchId: string;
  reactions: IReaction[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    reasoning: { type: String },
    model: { type: String },
    createdAt: { type: Date, default: Date.now },
    branchId: { type: String },
    parentMessageIndex: { type: Number },
  },
  { _id: true }
);

const ReactionSchema = new Schema<IReaction>(
  {
    messageIndex: { type: Number, required: true },
    reaction: { type: String, enum: ['up', 'down'], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ChatSchema = new Schema<IChat>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, default: 'New Chat' },
    messages: [MessageSchema],
    mode: { type: String, enum: ['chat', 'code', 'research'], default: 'chat' },
    aiModel: { type: String, default: 'axion-4.6' },
    pinned: { type: Boolean, default: false },
    branches: { type: Schema.Types.Mixed, default: {} },
    activeBranchId: { type: String, default: 'main' },
    reactions: [ReactionSchema],
  },
  { timestamps: true }
);

ChatSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);
