import { ScanSettingsLoader, GeneralSettingsLoader, AdvancedSettingsLoader, ProtectionSettingsLoader, SchedulerSettingsLoader } from "@/loaders/settings";
import { Braces, ClipboardClock, Cog, Search, Shield } from "lucide-react";
import { lazy } from "react";
import { ISettingsTab } from "../types";

const GeneralSettings = lazy(()=>import("@/contents/settings/general"));
const AdvancedSettings = lazy(()=>import("@/contents/settings/advanced"));
const ScanSettings = lazy(()=>import("@/contents/settings/scan"));
const ProtectionSettings = lazy(()=>import("@/contents/settings/protection"))
const SchedulerSettings = lazy(()=>import("@/contents/settings/scheduler"))

export const SETTINGS_TABS: ISettingsTab[] = [
     {
          page: "general",
          name: "General",
          Icon: Cog,
          Loader: GeneralSettingsLoader,
          LazyComponent: GeneralSettings
     },
     {
          page: "scan",
          name: "Scan",
          Icon: Search,
          Loader: ScanSettingsLoader,
          LazyComponent: ScanSettings
     },
     {
          page: "scheduler",
          name: "Scheduler",
          Icon: ClipboardClock,
          Loader: SchedulerSettingsLoader,
          LazyComponent: SchedulerSettings
     },
     {
          page: "protection",
          name: "Protection",
          Icon: Shield,
          Loader: ProtectionSettingsLoader,
          LazyComponent: ProtectionSettings
     },
     {
          page: "advanced",
          name: "Advanced",
          Icon: Braces,
          Loader: AdvancedSettingsLoader,
          LazyComponent: AdvancedSettings
     },
]