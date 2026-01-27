import { AppLayout } from "@/components/layout";
import { Suspense, lazy } from "react";
import UpdateLoader from "@/loaders/update";
const UpdateContent = lazy(()=>import("@/contents/update"))

export default function UpdateDefinitions(){
     return (
          <AppLayout className="flex flex-col justify-center gap-6 p-4">
               <Suspense fallback={<UpdateLoader/>}>
                    <UpdateContent />
               </Suspense>
          </AppLayout>
     )
}