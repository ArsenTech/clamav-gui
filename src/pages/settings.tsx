import { AppLayout } from "@/components/layout";
import { lazy, Suspense } from "react";
import SettingsLoader from "@/loaders/settings";
const SettingsContent = lazy(()=>import("@/contents/settings"))

export default function SettingsPage(){
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <Suspense fallback={<SettingsLoader/>}>
                    <SettingsContent/>
               </Suspense>
          </AppLayout>
     )
}