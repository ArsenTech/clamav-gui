import * as z from "zod"
import { DAYS_OF_THE_WEEK, INTERVALS, SCAN_ENUM } from "../constants"
import { TFunction } from "i18next"

export const getSchedulerSchema = (t: TFunction<"messages","form-validations">) => z.object({
     interval: z.enum([...INTERVALS],t("interval")),
     scanType: z.enum([...SCAN_ENUM],t("scanType")),
     days: z.enum([...DAYS_OF_THE_WEEK],t("days")),
     hours: z.int().min(0,t("hours.min")).max(23,t("hours.max")),
     minutes: z.int().min(0,t("minutes.min")).max(59,t("minutes.max"))
})
export const getPathFormSchema = (t: TFunction<"messages","form-validations">) => z.object({
     path: z.string().min(1,t("directory-path.required")).max(300,t("directory-path.too-long"))
})
export const getClearByDateSchema = (t: TFunction<"messages","form-validations">) => z.object({
     date: z.date().max(new Date(), {
          error: t("date-no-future"),
     }),
})
export const getClearByRangeSchema = (t: TFunction<"messages","form-validations">) => z.object({
     dateRange: z.object({
          from: z.date(),
          to: z.date(),
     })
     .refine(range => range.from <= range.to,{ path: ["to"], error: t("invalid-range")}),
})