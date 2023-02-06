import { z } from "zod";
import { createRouter } from "../createRouter";
import prisma from '@src/prisma'
import { userCache } from "@src/caching";
import { revalidateUserPages } from '@src/utils/isr'
import { editUserSchema, registerUserSchema } from "@src/schemas/userSchemas";
import { User, Validations } from "@prisma/client";

export const userRouter = createRouter()
  .mutation("register", {
    input: registerUserSchema,
    async resolve({ input, ctx }) {
      if (!ctx.session) throw "No session"

      // fetch account data
      const initialUser = await prisma.user.findUnique({
        where: {
          id: ctx.session.user.id
        },
        include: {
          accounts: true
        }
      })
      let profile
      if (initialUser?.accounts[0]) {
        profile = await prisma.oAuth2Profile.findUnique({
          where: {
            provider_providerAccountId: {
              provider: initialUser.accounts[0]?.provider,
              providerAccountId: initialUser.accounts[0]?.providerAccountId
            }
          }
        })
      }
      let emailVerified
      if (profile?.email_verified) {
        emailVerified = new Date()
      }
      else {
        emailVerified = null
      }

      // Put data in user
      try {
        const user = await prisma.user.update({
          where: {
            id: ctx.session.user.id
          },
          data: {
            ...input,
            emailVerified,
            profilePicUrl: initialUser?.image || profile?.image || (profile?.otherFields as {picture: string}).picture || "",
            status: "registered"
          },
          include: {validations: true}
        })
        await userCache.refresh(user.id, user)
        await revalidateUserPages(ctx.res, user.id)
      }
      catch (e) {
        console.log("Error registering profile", e)
        if ((e as any).meta.target.includes("email")) {
          return { message: "Error: el email ingresado ya está registrado"}
        }
        return { message: "Error de base de datos"}
      }
      // ctx.res.redirect("/auth/register/success?userId=" + ctx.session.user.id)
      return { message: "Created"}
    }
  })
  .mutation("delete", {
    async resolve({ ctx }) {
      if (!ctx.session) throw "No session"
      console.log(ctx.session)
      await prisma.user.delete({where: {
        id: ctx.session.user.id
      }})
      await userCache.invalidate(ctx.session.user.id)
      await revalidateUserPages(ctx.res, ctx.session.user.id)
    }
  })
  .mutation("edit", {
    input: editUserSchema,
    async resolve({input, ctx}) {
      if (!ctx.session) throw "No session"
      const userData = input
      
      if (ctx.session.user.id !== userData.id) throw "Not allowed to edit user"
      const userSkills = userData.skills || []
      const skillsToRemove = userData.skillsToRemove || []
      delete userData.skills
      delete userData.skillsToRemove

      const [_, user] = await prisma.$transaction([
        prisma.validations.deleteMany({
          where: {
            validatorId: userData.id,
            receiverId: userData.id,
            skillId: {
              in: skillsToRemove
            }
          }
        }),
        prisma.user.update({
          where: {
            id: userData.id
          },
          data: {
            ...userData,
            validations: {
              createMany: {
                data: userSkills.map((skill: string) => ({
                  validatorId: userData.id,
                  skillId: skill,
                  score: 0
                })),
                skipDuplicates: true
              },
            }
          },
          include: {
            validations: true//{where : {validatorId: userData.id}}
          }
        })
      ])
      
      await userCache.refresh(userData.id, user)
      await userCache.refresh(userData.id, user)
      await revalidateUserPages(ctx.res, userData.id)
      
      // ctx.res.redirect("/auth/register/success?userId=" + userData.id)
      return user
    }
  })
  .mutation("validate", {
    input: z.object({
      validatorId: z.string(),
      receiverId: z.string(),
      skillId: z.string(),
      score: z.number()
    }),
    async resolve({ input, ctx }) {
      const validation = input
      
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
      await userCache.invalidate(validation.receiverId)
      await revalidateUserPages(ctx.res, validation.receiverId)
    }
  })
  .query('data', {
    input: z.object({
        id: z.string(),
      }),
    async resolve({ input }) {
      return await userCache.get(input.id)
    },
  })
  .query('accounts', {
    input: z.object({
        id: z.string(),
      }),
    async resolve({ input }) {
      return (await prisma.user.findFirst({
        where: {
          id: input.id
        },
        select: {
          accounts: true
        }
      }))?.accounts
    },
  })
  .query('fetchMany', {
    input: z.object({
      ids: z.array(z.string())
    }),
    async resolve({ input }) {
      return await Promise.all(input.ids.map((id)=> userCache.get(id)))
    }
  });
