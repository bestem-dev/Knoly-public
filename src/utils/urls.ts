// export function getCurrentURL() {
//     return location.protocol + '//' + location.host
//     // return window.location.origin
// }

import { NextApiRequestQuery } from "next/dist/server/api-utils"

export const getCurrentURL = (): string => {
  if ((typeof window !== "undefined")) {
    return window.location.protocol + '//' + window.location.host
  }

  if (process.env.VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_GCR_ENV == "production") {
    if (process.env.NEXT_PUBLIC_PROD_URL) {
      return process.env.NEXT_PUBLIC_PROD_URL
    }
    throw Error("Missing PROD URL")
  }
  if (process.env.NGROK_ENV) {
    if (process.env.NGROK_URL ) {
      return process.env.NGROK_URL 
    }
    throw Error("Missing NGROK URL")
  }

  return "http://localhost:3000"
}

export const queryAsStringArray = (query: string | string[] | undefined): string[] => {
  let queryArray: string[]
  if (typeof query === "string") {
    queryArray = [query]
    }
    else {
    queryArray = query || []
  }
  return queryArray
}

export const handleLoginCallback = (query: NextApiRequestQuery) => {
  return queryAsStringArray(query.callbackUrl).filter(c => c!==getCurrentURL()+"/")[0]
}