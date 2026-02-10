import * as z from "zod"
import { DAYS_OF_THE_WEEK, INTERVALS, SCAN_ENUM } from "./constants"
import { TFunction } from "i18next"

export const getSchedulerSchema = (t: TFunction<"messages">) => z.object({
     interval: z.enum([...INTERVALS],t("form-validations.interval")),
     scanType: z.enum([...SCAN_ENUM],t("form-validations.scanType")),
     days: z.enum([...DAYS_OF_THE_WEEK],t("form-validations.days")),
     hours: z.int().min(0,t("form-validations.hours.min")).max(23,t("form-validations.hours.max")),
     minutes: z.int().min(0,t("form-validations.minutes.min")).max(59,t("form-validations.minutes.max"))
})
export const getExclusionsSchema = (t: TFunction<"messages">) => z.object({
     path: z.string().min(1,t("form-validations.exclusion-path.required")).max(300,t("form-validations.exclusion-path.too-long"))
})