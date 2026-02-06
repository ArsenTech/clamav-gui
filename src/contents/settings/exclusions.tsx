import DirExclusionsItem from "@/components/settings-item/dir-exclusions";
import { useBackendSettings } from "@/hooks/use-settings";
import { DEFAULT_BACKEND_SETTINGS } from "@/lib/settings";
import { BackendSettings } from "@/lib/types/settings";
import ExclusionsLoader from "@/loaders/components/exclusions";
import { useTransition, useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export default function ExclusionsSettings(){
     const [isFetching, startTransition] = useTransition()
     const {getSettingsByKey,setSettingsbyKey} = useBackendSettings()
     const [exclusions, setExclusions] = useState<BackendSettings["exclusions"]>(DEFAULT_BACKEND_SETTINGS.exclusions);
     useEffect(()=>{
          startTransition(async()=>{
               try {
                    const stored = await getSettingsByKey("exclusions")
                    setExclusions(val=>!stored ? val : stored)
               } catch (err){
                    toast.error("Failed to fetch existing exclusions");
                    console.error(err)
               }
          })
     },[])
     const updateExclusions = async(value: BackendSettings["exclusions"]) => {
          await setSettingsbyKey("exclusions",value);
          setExclusions(value)
     }
     const dirExclusions = useMemo(()=>!exclusions ? DEFAULT_BACKEND_SETTINGS.exclusions: exclusions,[exclusions]);
     const handleExclusionAction = async (value: string, action: "exclude" | "remove") => {
          if(value.trim()==="") return;
          const mainArr = !exclusions ? DEFAULT_BACKEND_SETTINGS.exclusions : exclusions
          const newArr = action==="exclude" ? [...mainArr,value] : mainArr.filter(val=>val!==value)
          await updateExclusions(newArr);
     }
     return (
          <div className="px-1 py-2 space-y-3">
               {isFetching ? (
                    <ExclusionsLoader items={dirExclusions.length}/>
               ) : (
                    <DirExclusionsItem
                         data={dirExclusions}
                         onSubmit={values=>handleExclusionAction(values.path,"exclude")}
                         onDelete={path=>handleExclusionAction(path,"remove")}
                    />
               )}
          </div>
     )
}