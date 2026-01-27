import { ScanSettingsLoader, GeneralSettingsLoader, AdvancedSettingsLoader} from "@/loaders/settings";
import { Braces, Cog, Search } from "lucide-react";
import { lazy } from "react";

const GeneralSettings = lazy(()=>import("@/contents/settings/general"));
const AdvancedSettings = lazy(()=>import("@/contents/settings/advanced"));
const ScanSettings = lazy(()=>import("@/contents/settings/scan"));

export const SETTINGS_TABS = [
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
]