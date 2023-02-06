import NextAuth, { NextAuthOptions, unstable_getServerSession } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@src/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import GoogleProvider from "next-auth/providers/google";
// import GitHubProvider from "next-auth/providers/github";
import GitHubProvider from "@src/oauth/customGithubProvider"
import LinkedInProvider from "next-auth/providers/linkedin";
import { userCache } from "@src/caching"
import { getCurrentURL } from "@src/utils/urls"
import { logger } from "@src/logger"
import { EthereumProvider } from "./EthereumProvider"

process.env.NEXTAUTH_URL = getCurrentURL()


export function getAuthOptions(req: NextApiRequest, res: NextApiResponse): NextAuthOptions {
  const providers = [
    EthereumProvider(req, res),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || ""
  }),
    LinkedInProvider({
    clientId: process.env.LINKEDIN_CLIENT_ID || "",
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || ""
  })
  ]
  // const isDefaultSigninPage =
  //   req.method === "GET" && req.query.nextauth?.includes("signin")

  // // Hides Sign-In with Ethereum from default sign page
  // if (isDefaultSigninPage) {
  //   providers.pop()
  // }
  
  return {
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: '/auth/login',
      // signOut: '/auth/signout',
      // error: '/auth/error', // TO-DO
      // verifyRequest: '/auth/loginEmailSent', // (used for check email message)
      // newUser: '/auth/register' // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async signIn({user, account, profile}){
        if (account.provider !== "Ethereum") {
          // Here I save the profile data for later usage
          if (profile.email) {
            const {email_verified, email, image, name, ...otherFields} = profile
            await prisma.oAuth2Profile.upsert({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId
                }
              },
              update: {},
              create: {
                email_verified: (email_verified as boolean),
                email,
                image,
                name,
                otherFields: JSON.parse(JSON.stringify(otherFields)),
                provider: account.provider,
                providerAccountId: account.providerAccountId
              }
            })
            // let emailVerified
            // if (profile.email_verified) {
            //   emailVerified = new Date()
            // }
            // Here I highjack the library and create the OAuth accounts and users myself. Then the library only logs in
            // const user = await prisma.user.upsert({
            //   where: {
            //     email: profile.email,
            //   },
            //   update: {},
            //   create: {
              //     email: profile.email,
            //     emailVerified: emailVerified,
            //     profilePicUrl: profile.image,
            //     name: profile.name,
            //     firstName: profile.name,
            //   }
            // })
            // await prisma.account.upsert({
            //   where: {
            //     provider_providerAccountId: {
            //       provider: account.provider,
            //       providerAccountId: account.providerAccountId
            //     }
            //   },
            //   update: {},
            //   create: {
            //     ...account,
            //     userId: user.id
            //   }
            // })
          }
        }
        
        return true
      },
      async session({ session, token }) {
        session.user.id = token.userId
        session.user.wallet = token.wallet
        return session
      },
      // async session(options) {
      //   console.log("Sign in callback options")
      //   console.log(options)
      //   return options.session
      // },
      async jwt({ token, account, user, profile }) {
        if (user) {
          token.wallet = (user.wallet as string) || ""
        }
        // let userId
        // if (token.wallet) {
        //   const user = await prisma.user.findUnique({
        //     where: {
        //       wallet: token.wallet
        //     },
        //     select: {
        //       id: true
        //     }
        //   })
        //   userId = user?.id
        // }
        // else if (account) {
        //   const userAccount = await prisma.account.findUnique({
        //     where: {
        //       provider_providerAccountId: {
        //         provider: account.provider,
        //         providerAccountId: account.providerAccountId
        //       }
        //     },
        //     select: {
        //       userId: true
        //     }
        //   })
        //   userId = userAccount?.userId
        // }
        // token.userId = userId || ""
        token.userId = token.sub || ""
        return token
      },
      // }
      // async jwt(options) {
      //   console.log("Sign in callback options")
      //   console.log(options)
      //   return options.token
      // },
      // async redirect({ url, baseUrl }){
      //   if (url === baseUrl) {
      //     console.log("same url")
      //   }
      //   return url
      // }
    }
  }
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, getAuthOptions(req, res))
}
