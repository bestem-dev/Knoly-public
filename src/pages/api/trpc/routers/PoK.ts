import { string, z } from "zod";
import { createRouter } from "../createRouter";
import prisma from '@src/prisma'
import UserDataQuery from "@src/graphql/UserData";
import { createGitHubPoK } from "@src/proofOfKnoly/github";
import { supportedSources } from "@src/proofOfKnoly/supportedSources";

export const PoKRouter = createRouter()
    .mutation("create", {
        input: z.object({
            account: z.enum(supportedSources)
        }),
        async resolve({input, ctx}) {
            if (!ctx.session) {
                throw "Unauthenticated"
            }
            switch (input.account) {
                case "github":
                    return createGitHubPoK(ctx.session.user.id)
                default:
                    throw "Unsupported account"
            }
        }
    })
    .query("get", {
        input: z.object({
            userId: string(),
            source: string().nullish()
        }),
        async resolve({input, ctx}) {
            return await prisma.proofOfKnoly.findMany({
                where: {
                    source: {
                        userId: input.userId,
                        provider: input.source || undefined
                    }
                },
                include: { source: true, dataSources: true}
            })
        }
    })
