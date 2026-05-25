import mongoose, { Schema, Document } from 'mongoose';

export interface IQuota extends Document {
  modelId: string;
  usageCount: number;
  dailyLimit: number;
  resetAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuotaSchema = new Schema<IQuota>(
  {
    modelId: { type: String, required: true, unique: true },
    usageCount: { type: Number, default: 0 },
    dailyLimit: { type: Number, default: 500 },
    resetAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Quota || mongoose.model<IQuota>('Quota', QuotaSchema);
