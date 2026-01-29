import * as z from "zod"
import { DirExclusionsSchema, PuaExclusionsSchema, SchedulerSchema } from "../schemas";

export type SchedulerType = z.infer<typeof SchedulerSchema>
export type DirExclusionsType = z.infer<typeof DirExclusionsSchema>
export type PuaExclusionsType = z.infer<typeof PuaExclusionsSchema>