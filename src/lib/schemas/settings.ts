import * as z from "zod"
import { COLORS } from "../constants/colors"
import { ScanProfileSchema } from "./scan-profile"
import { THEMES } from "../constants/settings"

const ScanProfileKeySchema = z.enum(["main", "custom", "file"]);
const colorKeys = Object.keys(COLORS) as (keyof typeof COLORS)[]

const FrontendSchema = z.object({
     theme: z.enum([...THEMES]),
     color: z.enum([...colorKeys]),
     dateFormat: z.enum(["dd/MM/yyyy HH:mm:ss", "MM/dd/yyyy HH:mm:ss", "yyyy-MM-dd HH:mm:ss"]),
     developerMode: z.boolean(),
     confirmStopScan: z.boolean(),
     autoScrollText: z.boolean(),
     maxLogLines: z.int().min(100).max(1500),
     currScanProfile: ScanProfileKeySchema,
     realTime: z.boolean(),
     enableSchedulerUI: z.boolean(),
     notifOnScanStart: z.boolean(),
     notifOnScanFinish: z.boolean(),
     notifPermitted: z.boolean(),
     behavior: z.enum(["balanced", "safe", "strict", "expert"]),
     badgeVisibility: z.enum(["icon", "icon-text", "text"]),
     sidebarCollapsible: z.enum(["offcanvas", "icon"]),
     reduceMotion: z.boolean()
})

const BackendSchema = z.object({
     scanProfiles: z.record(
          z.enum(["main", "custom", "file"]),
          ScanProfileSchema
     ).default({
          main: {},
          custom: {},
          file: {},
     }),
     exclusions: z.array(z.string().min(2).trim()).default([]),
     monitoringPaths: z.array(z.string().min(2).trim()).default([]),
     includeMacSystemExclusions: z.boolean().default(false),
})

export const SettingsMetadataSchema = z.object({
     schemaVersion: z.literal(1),
     name: z.string().min(2).trim(),
     version: z.string().min(2).trim(),
     identifier: z.string().min(2).trim(),
     frontend: FrontendSchema,
     backend: BackendSchema
})