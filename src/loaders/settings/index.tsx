import { Skeleton } from "@/components/ui/skeleton";
import GeneralSettingsLoader from "./general";

export {default as GeneralSettingsLoader} from "./general";
export {default as ScanSettingsLoader} from "./scan";
export {default as AdvancedSettingsLoader} from "./advanced"

export default function SettingsLoader(){
     return (
          <>
          <Skeleton className="h-6 md:h-[30px] lg:h-9 w-1/6"/>
          <Skeleton className="h-9 w-full"/>
          <GeneralSettingsLoader/>
          </>
     )
}