import { ScanSettingsLoader, GeneralSettingsLoader, AdvancedSettingsLoader, UpdateSettingsLoader } from "@/loaders/settings";
import { Braces, Cog, RotateCcw, Search } from "lucide-react";
import { lazy } from "react";
import { ISettingsTab } from "../types";

const GeneralSettings = lazy(()=>import("@/contents/settings/general"));
const AdvancedSettings = lazy(()=>import("@/contents/settings/advanced"));
const ScanSettings = lazy(()=>import("@/contents/settings/scan"));
const UpdateSettings = lazy(()=>import("@/contents/settings/update"));

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
          page: "advanced",
          name: "Advanced",
          Icon: Braces,
          Loader: AdvancedSettingsLoader,
          LazyComponent: AdvancedSettings
     },
     {
          page: "update",
          name: "Update",
          Icon: RotateCcw,
          Loader: UpdateSettingsLoader,
          LazyComponent: UpdateSettings
     }
]