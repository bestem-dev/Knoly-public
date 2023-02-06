import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's wallet address. */
      // address: string
      /** The user's id. */
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
      wallet?: string | null | undefined;
      id: string;
    }
  }
}



declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** Id in the database */
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    wallet?: string | null | undefined;
    userId: string;
  }
}