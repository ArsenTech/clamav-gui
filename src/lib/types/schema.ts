import * as z from "zod"
import { SchedulerSchema } from "../schemas";

export type SchedulerType = z.infer<typeof SchedulerSchema>