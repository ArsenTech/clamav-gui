import { Skeleton } from "@/components/ui/skeleton";
import GeneralSettingsLoader from "./general";
import { SettingsTab } from "@/lib/types";
import ScanSettingsLoader from "./scan";
import SchedulerSettingsLoader from "./scheduler";
import ExclusionsSettingsLoader from "./exclusions";
import AdvancedSettingsLoader from "./advanced";

export {default as GeneralSettingsLoader} from "./general";
export {default as ScanSettingsLoader} from "./scan";
export {default as AdvancedSettingsLoader} from "./advanced"
export {default as ExclusionsSettingsLoader} from "./exclusions"
export {default as SchedulerSettingsLoader} from "./scheduler"

interface Props{
     currPage: SettingsTab
}
export default function SettingsLoader({currPage}: Props){
     return (
          <>
          <div className="flex justify-between items-center gap-2 w-full">
               <Skeleton className="h-6 md:h-[30px] lg:h-9 w-1/6"/>
               <div className="flex items-center gap-3">
                    <Skeleton className="w-[117px] h-3.5"/>
                    <Skeleton className="w-48 h-9"/>
               </div>
          </div>
          <Skeleton className="h-9 w-full"/>
          {currPage==="general" ? (
               <GeneralSettingsLoader/>
          ) : currPage==="scan" ? (
               <ScanSettingsLoader/>
          ) : currPage==="scheduler" ? (
               <SchedulerSettingsLoader/>
          ) : currPage==="exclusions" ? (
               <ExclusionsSettingsLoader/>
          ) : (
               <AdvancedSettingsLoader/>
          )}
          </>
     )
}