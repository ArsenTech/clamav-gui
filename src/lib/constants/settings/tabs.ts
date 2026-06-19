import { ScanSettingsLoader, GeneralSettingsLoader, AdvancedSettingsLoader, UpdateSettingsLoader } from "@/loaders/settings";
import { Braces, Cog, RotateCcw, Search } from "lucide-react";
import { lazy } from "react";
import { ISettingsTab } from "@/lib/types";
import { SettingsTab } from "@/lib/types/enums";

export const SETTINGS_TABS: ISettingsTab[] = [
     {
          page: SettingsTab.General,
          Icon: Cog,
          Loader: GeneralSettingsLoader,
          LazyComponent: lazy(()=>import("@/contents/settings/general")),
          usesProfile: false
     },
     {
          page: SettingsTab.Scan,
          Icon: Search,
          Loader: ScanSettingsLoader,
          LazyComponent: lazy(()=>import("@/contents/settings/scan")),
          usesProfile: true
     },
     {
          page: SettingsTab.Advanced,
          Icon: Braces,
          Loader: AdvancedSettingsLoader,
          LazyComponent: lazy(()=>import("@/contents/settings/advanced")),
          usesProfile: true
     },
     {
          page: SettingsTab.Update,
          Icon: RotateCcw,
          Loader: UpdateSettingsLoader,
          LazyComponent: lazy(()=>import("@/contents/settings/update")),
          usesProfile: false
     }
]