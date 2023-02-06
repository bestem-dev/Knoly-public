import { z } from "zod";

export const suggestSkillSchema = z.object({
    name: z.string().max(20),
    description: z.string().max(140),
    userId: z.string()
})
