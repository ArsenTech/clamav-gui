import DirExclusionsItem from "@/components/settings-item/dir-exclusions";
import PuaExclusionsItem from "@/components/settings-item/pua-exclusions";
import { useBackendSettings } from "@/hooks/use-settings";
import { DEFAULT_BACKEND_SETTINGS } from "@/lib/settings";
import { BackendSettings } from "@/lib/types/settings";
import ExclusionsLoader from "@/loaders/components/exclusions";
import { useTransition, useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export default function ExclusionsSettings(){
     const [isFetching, startTransition] = useTransition()
     const {fetchBackendSettings, setBackendSettings} = useBackendSettings()
     const [exclusions, setExclusions] = useState<BackendSettings["exclusions"]>(DEFAULT_BACKEND_SETTINGS.exclusions);
     useEffect(()=>{
          startTransition(async()=>{
               try {
                    const settings = await fetchBackendSettings("exclusions")
                    setExclusions(val=>!settings ? val : settings)
               } catch (err){
                    toast.error("Failed to fetch existing protection settings");
                    console.error(err)
               }
          })
     },[])
     const updateExclusions = async <K extends keyof BackendSettings["exclusions"]>(key: K, value: BackendSettings["exclusions"][K]) => {
          await setBackendSettings("exclusions",key,value);
          setExclusions(prev=>({...prev, [key]: value}))
     }
     const dirExclusions = useMemo(()=>!exclusions.directory ? DEFAULT_BACKEND_SETTINGS.exclusions.directory : exclusions.directory,[exclusions.directory]);
     const puaExclusions = useMemo(()=>!exclusions.puaCategory ? DEFAULT_BACKEND_SETTINGS.exclusions.puaCategory : exclusions.puaCategory,[exclusions.puaCategory]);
     const handleExclusionAction = async  <K extends keyof BackendSettings["exclusions"]>(value: string, key: K, action: "exclude" | "remove") => {
          let newArr: string[] = []
          if(key === "directory") {
               const {directory} = exclusions
               const mainArr = !directory ? DEFAULT_BACKEND_SETTINGS.exclusions.directory : directory
               newArr = action==="exclude" ? [...mainArr,value] : mainArr.filter(val=>val!==value)
          } else {
               const {puaCategory} = exclusions
               const mainArr = !puaCategory ? DEFAULT_BACKEND_SETTINGS.exclusions.puaCategory : puaCategory
               newArr = action==="exclude" ? [...mainArr,value] : mainArr.filter(val=>val!==value)
          }
          await updateExclusions(key,newArr);
          setExclusions(prev=>({
               ...prev,
               [key]: newArr
          }))
     }
     return (
          <div className="px-1 py-2 space-y-3">
               {isFetching ? (
                    <ExclusionsLoader items={dirExclusions.length}/>
               ) : (
                    <DirExclusionsItem
                         data={dirExclusions}
                         onSubmit={values=>handleExclusionAction(values.path,"directory","exclude")}
                         onDelete={path=>handleExclusionAction(path,"directory","remove")}
                    />
               )}
               {isFetching ? (
                    <ExclusionsLoader items={puaExclusions.length}/>
               ) : (
                    <PuaExclusionsItem
                         data={puaExclusions}
                         onSubmit={values=>handleExclusionAction(values.category,"puaCategory","exclude")}
                         onDelete={category=>handleExclusionAction(category,"puaCategory","remove")}
                    />
               )}
          </div>
     )
}