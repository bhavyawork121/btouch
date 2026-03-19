import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IRefreshLog extends Document {
  username: string
  platform: string
  status: 'ok' | 'error' | 'stale'
  durationMs: number
  createdAt: Date
}

const RefreshLogSchema = new Schema<IRefreshLog>(
  {
    username: { type: String, required: true },
    platform: { type: String, required: true },
    status: { type: String, enum: ['ok','error','stale'], required: true },
    durationMs: { type: Number, required: true },
  },
  { timestamps: true }
)

RefreshLogSchema.index({ username: 1 })
RefreshLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 604800 }
)

export const RefreshLog: Model<IRefreshLog> =
  mongoose.models.RefreshLog ??
  mongoose.model<IRefreshLog>('RefreshLog', RefreshLogSchema)
