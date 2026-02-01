import { ScanSettingsLoader, GeneralSettingsLoader, AdvancedSettingsLoader, ExclusionsSettingsLoader, SchedulerSettingsLoader } from "@/loaders/settings";
import { Braces, ClipboardClock, Cog, Search, ShieldOff } from "lucide-react";
import { lazy } from "react";
import { ISettingsTab } from "../types";

const GeneralSettings = lazy(()=>import("@/contents/settings/general"));
const AdvancedSettings = lazy(()=>import("@/contents/settings/advanced"));
const ScanSettings = lazy(()=>import("@/contents/settings/scan"));
const ExclusionsSettings = lazy(()=>import("@/contents/settings/exclusions"))
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
          page: "exclusions",
          name: "Exclusions",
          Icon: ShieldOff,
          Loader: ExclusionsSettingsLoader,
          LazyComponent: ExclusionsSettings
     },
     {
          page: "advanced",
          name: "Advanced",
          Icon: Braces,
          Loader: AdvancedSettingsLoader,
          LazyComponent: AdvancedSettings
     },
]