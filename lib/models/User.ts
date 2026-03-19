import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  githubId: string
  email: string
  name: string
  avatarUrl: string
  username: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    githubId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true }
)

UserSchema.index({ username: 1 })
UserSchema.index({ githubId: 1 })

export const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema)
