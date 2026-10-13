import { QUICK_ACCESS_LINKS } from "@/lib/constants/links";
import { lazy, Suspense, useEffect, useState } from "react";
import { useSettings } from "@/context/settings";
import { DefinitionStatus, Indicator } from "@/lib/types/enums";
import { checkDefinitionStatus } from "@/data/app";
import { SafetyIndicatorLoader } from "@/loaders/overview";
import OverviewCard from "@/components/cards/overview";

const SafetyIndicator = lazy(()=>import("@/components/antivirus/indicator"));

export default function OverviewContent(){
     const {settings} = useSettings();
     const [definitionStatus, setDefinitionStatus] = useState<DefinitionStatus>(DefinitionStatus.Loading)
     const fetchDefinitionStatus = async()=>{
          try{
               const isOutdated = await checkDefinitionStatus()
               setDefinitionStatus(isOutdated ? DefinitionStatus.Outdated : DefinitionStatus.Updated)
          } catch {
               setDefinitionStatus(DefinitionStatus.Outdated)
          }
     }
     useEffect(()=>{
          fetchDefinitionStatus()
     },[])
     return (
          <>
               <Suspense fallback={<SafetyIndicatorLoader/>}>
                    <SafetyIndicator
                         definitionStatus={definitionStatus}
                         type={settings.realTime ? Indicator.Safe : Indicator.Alert}
                    />
               </Suspense>
               <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full p-4 gap-4">
                    {QUICK_ACCESS_LINKS.map((data,i)=>(
                         <OverviewCard
                              key={`item-${i+1}`}
                              data={data}
                         />
                    ))}
               </div>
          </>
     )
}