import { ScanSettingsLoader, GeneralSettingsLoader, AdvancedSettingsLoader, UpdateSettingsLoader } from "@/loaders/settings";
import { Braces, Cog, RotateCcw, Search } from "lucide-react";
import { lazy } from "react";
import { ISettingsTab } from "@/lib/types";
import { SettingsTab } from "@/lib/types/enums";

const GeneralSettings = lazy(()=>import("@/contents/settings/general"));
const AdvancedSettings = lazy(()=>import("@/contents/settings/advanced"));
const ScanSettings = lazy(()=>import("@/contents/settings/scan"));
const UpdateSettings = lazy(()=>import("@/contents/settings/update"));

export const SETTINGS_TABS: ISettingsTab[] = [
     {
          page: SettingsTab.General,
          Icon: Cog,
          Loader: GeneralSettingsLoader,
          LazyComponent: GeneralSettings
     },
     {
          page: SettingsTab.Scan,
          Icon: Search,
          Loader: ScanSettingsLoader,
          LazyComponent: ScanSettings
     },
     {
          page: SettingsTab.Advanced,
          Icon: Braces,
          Loader: AdvancedSettingsLoader,
          LazyComponent: AdvancedSettings
     },
     {
          page: SettingsTab.Update,
          Icon: RotateCcw,
          Loader: UpdateSettingsLoader,
          LazyComponent: UpdateSettings
     }
]