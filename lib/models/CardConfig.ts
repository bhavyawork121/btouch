import mongoose, { Schema, Document, Model } from 'mongoose'

interface PlatformCache {
  data: unknown
  cachedAt: Date | null
}

export interface ICardConfig extends Document {
  userId: mongoose.Types.ObjectId
  username: string
  linkedinUrl: string
  displayName: string
  headline: string
  bio: string
  avatarUrl: string
  currentRole: string
  currentCompany: string
  location: string
  githubHandle: string
  leetcodeHandle: string
  cfHandle: string
  gfgHandle: string
  githubCache: PlatformCache
  leetcodeCache: PlatformCache
  cfCache: PlatformCache
  gfgCache: PlatformCache
  linkedinCache: PlatformCache
  theme: string
  accentColor: string
  showPlatforms: string[]
  createdAt: Date
  updatedAt: Date
}

const PlatformCacheSchema = new Schema<PlatformCache>(
  {
    data: { type: Schema.Types.Mixed, default: null },
    cachedAt: { type: Date, default: null },
  },
  { _id: false }
)

const CardConfigSchema = new Schema<ICardConfig>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },

    linkedinUrl: { type: String, default: '' },
    displayName: { type: String, default: '' },
    headline: { type: String, default: '' },
    bio: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    currentRole: { type: String, default: '' },
    currentCompany: { type: String, default: '' },
    location: { type: String, default: '' },

    githubHandle: { type: String, default: '' },
    leetcodeHandle: { type: String, default: '' },
    cfHandle: { type: String, default: '' },
    gfgHandle: { type: String, default: '' },

    githubCache: { type: PlatformCacheSchema, default: () => ({}) },
    leetcodeCache: { type: PlatformCacheSchema, default: () => ({}) },
    cfCache: { type: PlatformCacheSchema, default: () => ({}) },
    gfgCache: { type: PlatformCacheSchema, default: () => ({}) },
    linkedinCache: { type: PlatformCacheSchema, default: () => ({}) },

    theme: { type: String, default: 'dark' },
    accentColor: { type: String, default: 'indigo' },
    showPlatforms: { type: [String], default: ['github','leetcode','codeforces','gfg'] },
  },
  { timestamps: true }
)

CardConfigSchema.index({ username: 1 })
CardConfigSchema.index({ userId: 1 })

export const CardConfig: Model<ICardConfig> =
  mongoose.models.CardConfig ??
  mongoose.model<ICardConfig>('CardConfig', CardConfigSchema)
