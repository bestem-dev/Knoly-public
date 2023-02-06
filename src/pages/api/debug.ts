// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { logger } from '@src/logger'
import { getCurrentURL } from '@src/utils/urls'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  logger.info({
    GCR_RNV: process.env.GCR_RNV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_PROD_URL: process.env.NEXT_PUBLIC_PROD_URL,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
  })
  logger.info({
    currentUrl: getCurrentURL()
  })
  res.status(200).json({ message: "See logs for current configuration" })
}
