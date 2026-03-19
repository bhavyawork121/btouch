import { connectDB } from './mongodb'
import { CardConfig } from './models/CardConfig'

const TTL_MS = {
  github: 86400 * 1000,
  leetcode: 21600 * 1000,
  codeforces: 21600 * 1000,
  gfg: 43200 * 1000,
  linkedin: 604800 * 1000,
} as const

type Platform = keyof typeof TTL_MS

const fieldMap: Record<Platform, string> = {
  github: 'githubCache',
  leetcode: 'leetcodeCache',
  codeforces: 'cfCache',
  gfg: 'gfgCache',
  linkedin: 'linkedinCache',
}

export async function getFromCache<T>(
  username: string,
  platform: Platform
): Promise<T | null> {
  await connectDB()
  const card = await CardConfig
    .findOne({ username })
    .select(fieldMap[platform])
    .lean()

  if (!card) return null

  const cache = ((card as unknown) as Record<string, { cachedAt?: Date | string | null; data?: T | null }>)[fieldMap[platform]]
  if (!cache?.cachedAt || !cache?.data) return null

  const age = Date.now() - new Date(cache.cachedAt).getTime()
  if (age > TTL_MS[platform]) return null

  return cache.data as T
}

export async function saveToCache<T>(
  username: string,
  platform: Platform,
  data: T
): Promise<void> {
  await connectDB()
  await CardConfig.updateOne(
    { username },
    { $set: { [fieldMap[platform]]: { data, cachedAt: new Date() } } }
  )
}

export async function clearCache(username: string, platform: Platform): Promise<void> {
  await connectDB()
  await CardConfig.updateOne(
    { username },
    { $set: { [fieldMap[platform]]: { data: null, cachedAt: null } } }
  )
}

export async function clearAllCaches(username: string): Promise<void> {
  await connectDB()
  await CardConfig.updateOne(
    { username },
    {
      $set: {
        githubCache: { data: null, cachedAt: null },
        leetcodeCache: { data: null, cachedAt: null },
        cfCache: { data: null, cachedAt: null },
        gfgCache: { data: null, cachedAt: null },
        linkedinCache: { data: null, cachedAt: null },
      },
    }
  )
}
