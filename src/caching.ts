import Redis from 'ioredis'
import prisma from "./prisma"
import { logger } from "./logger"
import { User, Validations } from '@prisma/client'


let redis: Redis | undefined
if (!process.env.DISABLE_CACHE) {
  redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT!),
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD
  })
}


function getCachedData(baseKey: string, argKey: string, fetchData: () => Promise<any>): Promise<any> {
    const cacheKey = baseKey + (argKey ? `_${argKey}`:"")
    return new Promise(async (resolve, reject) => {
      let fetched = false
      if (redis) {
        await redis.get(cacheKey, (err, result) => {
          if (err) {
            logger.error(err)
            reject()
            return
          }
          if (result) {
            const data = JSON.parse(result)
            resolve(data)
            fetched = true
            return
          }
        })
      }
      if (fetched) return
      const data = await fetchData()
      if (redis) redis.set(cacheKey, JSON.stringify(data))
      resolve(data)
    })
}


export async function getSkillList() {
  return await getCachedData(
    "allSkills",
    "",
    () => prisma.skill.findMany({})
  )
}


async function fetchUser(id: string) {
  return await prisma.user.findUnique({
      where: {
        id: id
      },
      include: {
        validations: true
      }
  })
}

export const userCache: {
  get: (id: string) => Promise<User & { validations: Validations[]}>
  invalidate: (id: string) => Promise<void>
  refresh: (id: string, userData: User & {validations: Validations[]}) => Promise<void>
} = {
  get: (id: string) => getCachedData("users", id, () => fetchUser(id)),
  invalidate: async (id) => {
    if (redis) await redis.del(`users_${id}`)
  },
  refresh: async (id, userData) => {
    if (redis) await redis.set(`users_${id}`, JSON.stringify(userData))
  }
}
