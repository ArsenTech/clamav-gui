import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, SearchCheck, ShieldAlert, ShieldCheck, ShieldClose } from "lucide-react"
import { Spinner } from "../ui/spinner";
import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/i18n/locale";
import { DefinitionStatus, Indicator } from "@/lib/types/enums";

interface Props{
     type: Indicator
     definitionStatus: DefinitionStatus
}
export default function SafetyIndicator({type, definitionStatus}: Props){
     const lastScanned = useMemo(()=>{
          const stored = localStorage.getItem("last-scanned");
          return stored ? new Date(parseInt(stored)) : null;
     },[]);
     const {t} = useTranslation("overview");
     const {dateFns} = useLocale()
     const Icon = type==="safe" ? ShieldCheck : type==="warning" ? ShieldAlert : ShieldClose;
     return (
          <div className={cn(
               "h-72 bg-linear-to-b from-transparent w-full rounded-bl-[128px] flex justify-center md:justify-between items-center px-10 flex-col md:flex-row",
               type==="safe" && "to-emerald-200 dark:to-emerald-900",
               type==="alert" && "to-red-200 dark:to-red-900",
               (type==="warning" || definitionStatus==="outdated") && "to-amber-200 dark:to-amber-900"
          )}>
               {definitionStatus==="outdated" ? (
                    <ShieldAlert className="size-24 md:size-48 md:flex-1 text-amber-900 dark:text-amber-400"/>
               ) : (
                    <Icon className={cn("size-24 md:size-48 md:flex-1",type==="safe" && "text-emerald-900 dark:text-emerald-400",type==="alert" && "text-red-900 dark:text-red-400",type==="warning" && "text-amber-900 dark:text-amber-400")}/>
               )}
               <div className="flex flex-col items-center justify-center gap-2 flex-wrap md:flex-3">
                    <h1 className={
                         cn(
                              "text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight font-medium mt-2 md:mt-0 text-center w-full",
                              definitionStatus==="outdated" ? "" : "xl:text-6xl 2xl:text-7xl"
                         )
                    }>{t(`indicator.${definitionStatus==="outdated" ? "outdated" : type}`)}</h1>
                    <ul className="flex justify-center items-center gap-4 flex-wrap flex-col lg:flex-row w-full md:w-3/4">
                         <li className="flex items-center gap-2 text-base md:text-lg flex-1 md:flex-none!">
                              <SearchCheck className="size-5 md:size-6"/>
                              {lastScanned ? (
                                   <span>
                                        {t("indicator.last-scan")}{" "}
                                        {formatDistanceToNow(lastScanned,{
                                             includeSeconds: true,
                                             addSuffix: true,
                                             locale: dateFns
                                        })}
                                   </span>
                              ) : t("indicator.never-scanned")}
                         </li>
                         <li className="flex items-center gap-2 text-base md:text-lg flex-1 md:flex-none!">
                              {definitionStatus==="loading" ? <Spinner className="size-5 md:size-6"/> : definitionStatus==="outdated" ? <AlertCircle className="size-5 md:size-6"/> : <CheckCircle className="size-5 md:size-6"/>}
                              {t("definition.title",{
                                   status: t(`definition.${definitionStatus}`)
                              })}
                         </li>
                    </ul>
               </div>
          </div>
     )
}