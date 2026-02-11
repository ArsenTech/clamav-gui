import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Progress } from "../ui/progress";
import { ButtonGroup } from "../ui/button-group";
import Installation from "./steps/installation";
import AddPath from "./steps/add-path";
import { Trans, useTranslation } from "react-i18next";
import LanguageSelector from "@/i18n/languages";

const steps = [
     { alias: "installation", element: <Installation/> },
     { alias: "add-to-path", element: <AddPath/> }
] as const

interface Props{
     isPending: boolean,
     handleCheck: () => void
}
export default function NoClamAVPage({isPending, handleCheck}: Props){
     const [step, setStep] = useState(0);
     const currStep = useMemo(()=>steps[step],[step])
     const {t} = useTranslation("no-clamav-page")
     const handleClickNext = () => {
          if(step+1===steps.length){
               handleCheck()
          } else {
               setStep(prev=>(prev+1)%steps.length)
          }
     }
     return (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 h-screen">
               <div className="flex items-center justify-center text-center">
                    <img src="/shrug.webp" alt="Uncertain" width={450} height={450}/>
               </div>
               <div className="flex flex-col items-center justify-evenly text-center gap-4 py-4">
                    <div className="space-y-2">
                         <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight font-medium">
                              <Trans
                                   ns="no-clamav-page"
                                   i18nKey="title"
                                   components={{
                                        primary: <span className="text-primary"/>
                                   }}
                              />
                         </h1>
                         <div className="w-full p-2">
                              <div className="flex justify-between items-center flex-wrap gap-2 py-2">
                                   <p className="font-medium text-muted-foreground">
                                        {t("step",{
                                             current: step+1,
                                             total: steps.length
                                        })}
                                   </p>
                                   <p className="font-medium">
                                        {t(`${currStep.alias}.title`)}
                                   </p>
                              </div>
                              <Progress value={(step/(steps.length-1))*100}/>
                         </div> 
                    </div>
                    {currStep.element}
                    <div className="flex items-center justify-center gap-2">
                         <ButtonGroup>
                              <Button variant="outline" disabled={step+1!==steps.length} onClick={()=>setStep(prev=>(prev-1)%steps.length)}>
                                   <ChevronLeft/>
                                   {t("buttons.prev")}
                              </Button>
                              <Button onClick={handleClickNext} disabled={isPending}>
                                   {isPending ? <Spinner/> : step+1!==steps.length ? <ChevronRight/> : <RotateCcw/>}
                                   {isPending ? t("buttons.check.pending") : step+1!==steps.length ? t("buttons.next") : t("buttons.check.original")}
                              </Button>
                         </ButtonGroup>
                         <LanguageSelector/>
                    </div>
               </div>
          </div>
     )
}