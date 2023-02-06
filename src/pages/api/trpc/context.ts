import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession } from "next-auth";
import { getAuthOptions } from "../auth/[...nextauth]";

export async function createContext(ctx: trpcNext.CreateNextContextOptions) {
  const { req, res } = ctx;
  const session = await unstable_getServerSession(req, res, getAuthOptions(req, res))
  return {
    req,
    res,
    session
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;