import { AppLayout } from "@/components/layout";
import { lazy, Suspense, useMemo } from "react";
import SettingsLoader from "@/loaders/settings";
import { SettingsTab } from "@/lib/types/enums";
const SettingsContent = lazy(()=>import("@/contents/settings"))

export default function SettingsPage(){
     const settingsTab = useMemo(()=>(localStorage.getItem("settings-tab") as SettingsTab) || "general",[])
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <Suspense fallback={<SettingsLoader currPage={settingsTab}/>}>
                    <SettingsContent/>
               </Suspense>
          </AppLayout>
     )
}