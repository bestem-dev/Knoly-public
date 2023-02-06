// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { logger } from '@src/logger'
import { getCurrentURL } from '@src/utils/urls'
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { getAuthOptions } from './[...nextauth]'
import prisma from "@src/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const session = await unstable_getServerSession(req, res, getAuthOptions(req, res))
    if (!session) {
        res.redirect("/auth/login")
        return
    }
    session.user
    const user = await prisma.user.findUnique({
        where: {
            id: session.user?.id
        },
        select: {
            status: true
        }
    })

    if (!user) {
        res.redirect("/auth/login")
        return
    }
    if (user.status === "unregistered") {
        res.redirect("/auth/register")
        return
    }
    const callbackUrl = (req.query.callbackUrl as string)

    if (!callbackUrl) {
        res.redirect(`/users/${session.user.id}/`)
    }
    res.redirect(callbackUrl)
}
