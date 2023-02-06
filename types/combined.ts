import { User, Validations } from "@prisma/client";

export type ExtendedUser = User & {validations: Validations[]}