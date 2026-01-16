import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, RotateCcw } from "lucide-react";

export default function UpdateDefinitions(){
     const isRequired = false;
     const Icon = !isRequired ? CheckCircle : AlertCircle
     return (
          <AppLayout className={"grid gris-cols-1 md:grid-cols-2 gap-10 p-4"}>
               <div className="space-y-4">
                    <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Definition Updater</h1>
                    <div className="flex flex-col items-center gap-4">
                         <div className="flex justify-center items-center gap-4">
                              <Icon className={cn("size-12",isRequired ? "text-destructive" : "text-emerald-600")}/>
                              <div className="text-center space-y-0.5">
                                   <h2 className={cn("text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold",isRequired ? "text-red-900" : "text-emerald-900")}>{isRequired ? "Update Required!" : "Up to date!"}</h2>
                                   <p className="text-sm text-muted-foreground">Last Updated: 1 hour ago</p>
                              </div>
                         </div>
                         <Button><RotateCcw/> Update Database</Button>
                    </div>
               </div>
               <div className="space-y-3 px-3 text-lg overflow-y-auto max-h-[700px]">
                    <h2 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Log</h2>
                    <pre className="whitespace-pre-wrap">
                         asdasdadasdadsasd

                         asdfasfasfasfasfasfasf
                         asdasdadasdadsasd


                         asdfasfasfasfasfasfasf
                         asdasdadasdadsasd
                    </pre>
               </div>
          </AppLayout>
     )
}