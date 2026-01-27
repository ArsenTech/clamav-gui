import { AppLayout } from "@/components/layout";
import LogLoader from "@/loaders/log";
import { Suspense, lazy} from "react";
const LogContent = lazy(()=>import("@/contents/log"))

interface Props{
     returnUrl: string
}
export default function LogPage({returnUrl}: Props){
     return (
          <AppLayout className="space-y-4 p-4">
               <Suspense fallback={<LogLoader/>}>
                    <LogContent returnUrl={returnUrl}/>
               </Suspense>
          </AppLayout>
     )
}