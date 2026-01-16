import * as z from "zod"
import { SCAN_ENUM } from "./constants"

export const SchedulerSchema = z.object({
     interval: z.enum(["daily","weekly","monthly"]),
     scanType: z.enum([...SCAN_ENUM]),
     days: z.enum(["mon","tue","wed","thu","fri","sat","sun"]),
     hours: z.int().min(0).max(23),
     minutes: z.int().min(0).max(59)
})