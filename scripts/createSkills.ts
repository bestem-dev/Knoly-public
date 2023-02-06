import { PrismaClient, Skill } from '@prisma/client'
import Redis from 'ioredis'

import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({path: path.join(__dirname, '..', '.env.production')})

import { getSkillList } from '../src/caching' // @ Remapping doesn't work here
import skills from './skills.json'

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT!),
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD
  })

const prisma = new PrismaClient()

async function main() {
    console.log("Fetching current skills from db")
    const currentSkills = await prisma.skill.findMany({})

    const currentSkillsNames = new Set(currentSkills.map((s)=>s.name))
    const newSkillsMap = new Map(skills.map((s)=>[s.name, s.description]))

    let newSkills = skills.filter((s) => !currentSkillsNames.has(s.name))
    let modifiedSkills: Skill[] = []
    currentSkills.forEach((s) => {
        const newDesc = newSkillsMap.get(s.name)
        if (s.description !== newDesc){
            modifiedSkills.push({
                ...s,
                description: newDesc || ""
            })
        }
    })

    console.log("New skills to add:", newSkills)
    console.log("Skills to update:", modifiedSkills)
    await prisma.skill.createMany({
        data: newSkills
    })
    console.log("Skills added")
    await prisma.$transaction(modifiedSkills.map((s) => prisma.skill.update({
        data: s,
        where: {
            id: s.id
        }
    })))
    
    console.log("Changed skills updated")
    await redis.del("allSkills")
    await getSkillList()
    console.log("Cache Updated")
    process.exit()
}


main()