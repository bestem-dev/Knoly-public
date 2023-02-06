import { z } from "zod"

const phoneNumberRegex = new RegExp("^$|^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$")

export const registerUserSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().nullish(),
  phoneNumber: z.string().regex(phoneNumberRegex).nullish(),
  email: z.string().email()
})

export const editUserSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().nullish(),
  phoneNumber: z.string().regex(phoneNumberRegex).nullish(),
  email: z.string().email(),
  description: z.string().max(50).nullish(),
  bio: z.string().max(1000).nullish(),
  profilePicUrl: z.string().url().or(z.string().length(0).nullable()),
  skills: z.string().array().nullish(),
  skillsToRemove: z.string().array().nullish(),
})