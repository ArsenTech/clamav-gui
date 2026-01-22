import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Progress } from "../ui/progress";
import { ButtonGroup } from "../ui/button-group";
import Installation from "./steps/installation";
import AddPath from "./steps/add-path";

const steps = [
     {
          name: "Installation",
          element: (
               <Installation/>
          )
     },
     {
          name: "Adding to PATH",
          element: (
               <AddPath/>
          )
     }
]

interface Props{
     isPending: boolean,
     handleCheck: () => void
}
export default function NoClamAVPage({isPending, handleCheck}: Props){
     const [step, setStep] = useState(0);
     const currStep = useMemo(()=>steps[step],[step])
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
               <div className="flex flex-col items-center justify-evenly text-center gap-4">
                    <div className="space-y-2">
                         <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight font-medium">Oops, <span className="text-primary">ClamAV</span> is not installed</h1>
                         <div className="w-full p-2">
                              <div className="flex justify-between items-center flex-wrap gap-2 py-2">
                                   <p className="font-medium text-muted-foreground">Step {step+1} of {steps.length}</p>
                                   <p className="font-medium">{currStep.name}</p>
                              </div>
                              <Progress value={(step/(steps.length-1))*100}/>
                         </div> 
                    </div>
                    {currStep.element}
                    <ButtonGroup>
                         <Button variant="outline" disabled={step+1!==steps.length} onClick={()=>setStep(prev=>(prev-1)%steps.length)}>
                              <ChevronLeft/> Previous
                         </Button>
                         <Button onClick={handleClickNext} disabled={isPending}>
                              {isPending ? <Spinner/> : step+1!==steps.length ? <ChevronRight/> :  <RotateCcw/>}
                              {isPending ? "Checking..." : step+1!==steps.length ? "Next" : "Check Availability"}
                         </Button>
                    </ButtonGroup>
               </div>
          </div>
     )
}