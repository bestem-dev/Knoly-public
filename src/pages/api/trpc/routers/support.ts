import { createRouter } from "../createRouter";
import prisma from '@src/prisma'
import { suggestSkillSchema } from "@src/schemas/supportSchemas";


export const supportRouter = createRouter()
  .mutation("suggest-skill", {
    input: suggestSkillSchema,
    async resolve({ input }) {
      await prisma.sugestedSkill.create({
        data: input
      })
    }
  })
