import * as z from "zod"
import { DAYS_OF_THE_WEEK, INTERVALS, SCAN_ENUM } from "./constants"

export const SchedulerSchema = z.object({
     interval: z.enum([...INTERVALS],"Please set the interval type"),
     scanType: z.enum([...SCAN_ENUM],"Please choose the scan type"),
     days: z.enum([...DAYS_OF_THE_WEEK],"Please choose a day of the week"),
     hours: z.int().min(0).max(23),
     minutes: z.int().min(0).max(59)
})
export const ExclusionsSchema = z.object({
     path: z.string().min(0).max(300)
})