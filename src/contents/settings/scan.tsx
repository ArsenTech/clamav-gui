import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/context/settings";
import { DEFAULT_SETTINGS, FILE_SCAN_WHITELIST, SCAN_OPTION_ICON, DEFAULT_BACKEND_SETTINGS } from "@/lib/constants/settings";
import { isDescKey, SCAN_SETTINGS_GROUPED } from "@/lib/constants/settings/scan-options";
import { ScanOptionGroup } from "@/lib/types/enums";
import { Search } from "lucide-react";
import SettingsItem from "@/components/settings-item";
import { Skeleton } from "@/components/ui/skeleton";
import { useScanProfile } from "@/hooks/use-scan-profile";
import { SettingsProps } from "@/lib/types/props";
import DirExclusionsItem from "@/components/settings-item/exclusions";
import { useBackendSettings } from "@/hooks/use-settings";
import { BackendSettings } from "@/lib/types/settings";
import ExclusionsLoader from "@/components/loaders/exclusions";
import { useTransition, useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import SettingsOption from "@/components/settings-item/settings-option";
import { useTranslation } from "react-i18next";
import { ChoiceOption } from "@/components/settings-item/scan-option";

export default function ScanSettings({scanProfile}: SettingsProps){
     const {settings, setSettings} = useSettings();
     const { values, setValue, isLoading } = useScanProfile(scanProfile);
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
     const {t: scanTxt} = useTranslation("scan-settings")
     const {t} = useTranslation("settings")
     return (
          <div className="px-1 py-2 space-y-3">
               <SettingsItem
                    Icon={Search}
                    title={t("scan.title")}
                    className="space-y-4"
                    description={t("scan.desc")}
               >
                    <SettingsOption
                         title={t("scan.confirm-stop.title")}
                         description={t("scan.confirm-stop.desc")}
                    >
                         <Switch
                              defaultChecked={settings.confirmStopScan || DEFAULT_SETTINGS.confirmStopScan}
                              checked={settings.confirmStopScan}
                              onCheckedChange={checked=>setSettings({confirmStopScan: checked})}
                         />
                    </SettingsOption>
               </SettingsItem>
               {Object.entries(SCAN_SETTINGS_GROUPED).filter(([key])=>key!=="advanced" as ScanOptionGroup).map(([key,options])=>{
                    const visibleOptions = scanProfile === "file" ? options.filter(o =>FILE_SCAN_WHITELIST.includes(o.optionKey)) : options;
                    return visibleOptions.length > 0 ? (
                         <SettingsItem
                              key={key}
                              Icon={SCAN_OPTION_ICON[key as ScanOptionGroup]}
                              title={scanTxt(`option-group.${key as ScanOptionGroup}`)}
                              className="space-y-4"
                         >
                              {visibleOptions.map(option=>(
                                   <SettingsOption
                                        title={scanTxt(`labels.${option.optionKey}`)}
                                        description={option.flag}
                                        tooltip={isDescKey(option.optionKey) ? scanTxt(`descriptions.${option.optionKey}`) : undefined}
                                   >
                                        {option.value.kind==="yes-no" ? (
                                             isLoading ? (
                                                  <Skeleton className="w-8 h-[18px]"/>
                                             ): (
                                                  <Switch
                                                       checked={(values[option.optionKey] ?? option.value.default) as boolean}
                                                       onCheckedChange={checked => setValue(option.optionKey, checked)}
                                                  />
                                             )
                                        ) : option.value.kind==="choice" ? (
                                             isLoading ? (
                                                  <Skeleton className="h-9 w-32"/>
                                             ) : (
                                                  <ChoiceOption
                                                       value={String(values[option.optionKey] ?? option.value.default)}
                                                       onValueChange={val=>setValue(option.optionKey, typeof option.value.default === "number" ? Number(val) : val)}
                                                       label={scanTxt(`labels.${option.optionKey}`)}
                                                       scanTxt={scanTxt}
                                                       choiceKey={option.optionKey==="structuredSSNFormat" ? "ssn-formats" : "sym-links"}
                                                  />
                                             )
                                        ) : isLoading ? (
                                             <Skeleton className="w-1/3 h-9"/>
                                        ) : (
                                             <Input
                                                  type={option.value.inputType==="number" ? "number" : "text"}
                                                  min={option.value.min}
                                                  max={option.value.max}
                                                  className="max-w-1/3"
                                                  value={(values[option.optionKey] ?? option.value.default ?? "") as number}
                                                  onChange={e =>setValue(option.optionKey, Number(e.target.value))}
                                             />
                                        )}
                                   </SettingsOption>
                              ))}
                         </SettingsItem>
                    ) : null})
               }
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