import { AppLayout } from "@/components/layout";
import useWindowTitle from "@/hooks/use-window-title";
import LogLoader from "@/loaders/log";
import { Suspense, lazy} from "react";
import { useTranslation } from "react-i18next";
const LogContent = lazy(()=>import("@/contents/log"))

interface Props{
     returnUrl: string,
     category?: string
}
export default function LogPage({returnUrl, category}: Props){
     const {t} = useTranslation()
     useWindowTitle(t("log.title"))
     return (
          <AppLayout className="space-y-4 p-4">
               <Suspense fallback={<LogLoader/>}>
                    <LogContent returnUrl={returnUrl} categoryParam={category}/>
               </Suspense>
          </AppLayout>
     )
}