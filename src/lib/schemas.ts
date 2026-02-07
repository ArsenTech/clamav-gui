import * as z from "zod"
import { SCAN_ENUM } from "./constants"

export const SchedulerSchema = z.object({
     interval: z.enum(["daily","weekly","monthly"],"Please set the interval type"),
     scanType: z.enum([...SCAN_ENUM],"Please choose the scan type"),
     days: z.enum(["mon","tue","wed","thu","fri","sat","sun"],"Please choose a day of the week"),
     hours: z.int().min(0).max(23),
     minutes: z.int().min(0).max(59)
})
export const ExclusionsSchema = z.object({
     path: z.string().min(0).max(300)
})