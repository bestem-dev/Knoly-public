import CredentialsProvider from "next-auth/providers/credentials"
import { SiweMessage } from "siwe"
import prisma from "@src/prisma"
import { logger } from "@src/logger"
import { getCurrentURL } from "@src/utils/urls"
import { getCsrfToken } from "next-auth/react"
import { NextApiRequest, NextApiResponse } from "next"

export const EthereumProvider = (req: NextApiRequest, res: NextApiResponse) => {
  return CredentialsProvider({
    id: "Ethereum",
    name: "Ethereum",
    credentials: {
      message: {
        label: "Message",
        type: "text",
        placeholder: "0x0",
      },
      signature: {
        label: "Signature",
        type: "text",
        placeholder: "0x0",
      },
    },
    async authorize(credentials) {
      try {
        const siwe = new  SiweMessage(JSON.parse(credentials?.message || "{}"))
        const nextAuthUrl = new URL(getCurrentURL())
        logger.info({
          message: "login attempt",
          currentUrl: nextAuthUrl,
          signatureUrl: siwe.domain
        })
        if (siwe.domain !== nextAuthUrl.host) {
          console.log("Invalid Host")
          console.log(siwe.domain, "!=", nextAuthUrl.host)
          return null
        }

        if (siwe.nonce !== (await getCsrfToken({ req }))) {
          console.log("Invalid Nonce")
          return null
        }
        await siwe.validate(credentials?.signature || "")

        const user = await prisma.user.upsert({
          where: {
            wallet: siwe.address
          },
          update: {},
          create: {
            wallet: siwe.address
          }
        })

        return {
          id: user.id,
          wallet: siwe.address,
        }
      } catch (e) {
        logger.error(e)
        return null
      }
    },
  })
}