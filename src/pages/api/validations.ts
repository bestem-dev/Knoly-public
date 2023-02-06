import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@src/prisma'
import { getSession } from 'next-auth/react'
import { Validations } from '@prisma/client'
import { userCache } from '@src/caching'
import { revalidateUserPages } from '@src/utils/isr'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
  ) {
    const session = await getSession({ req })
    switch (req.method) {
      case "POST" : {
        const validation: Validations = req.body.validation
        const userWallet: string = req.body.targetWallet
        
        await prisma.validations.upsert({
            where: {
                validatorId_receiverId_skillId: {
                    skillId: validation.skillId,
                    validatorId: validation.validatorId,
                    receiverId: validation.receiverId
                }
            },
            create: {
                skillId: validation.skillId,
                validatorId: validation.validatorId,
                receiverId: validation.receiverId,
                score: 1
            },
            update: {}
        })
        await userCache.invalidate(userWallet)
        await revalidateUserPages(res, userWallet)
        return res.status(200).end()
      }
      default: {
        return res.status(405).end()
      }
    }
  }
  