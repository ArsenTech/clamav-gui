import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Progress } from "@/components/ui/progress";
import { Pause, Square } from "lucide-react";

export default function ScanProcess(){
     return (
          <>
               <Progress value={50}/>
               <p className="text-2xl font-semibold text-center">50% - 12345 files scanned</p>
               <ButtonGroup className="w-full">
                    <Button className="flex-1"><Pause/> Pause the Scan</Button>
                    <Button variant="secondary" className="flex-1"><Square/> Stop the Scan</Button>
               </ButtonGroup>
               <div className="flex justify-center items-center gap-2 flex-col">
                    <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full">
                         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Location Status</h2>
                         <code>C:\Users\User\...</code>
                    </div>
                    <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full">
                         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Findings</h2>
                         <p>2 Threats</p>
                    </div>
                    <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full">
                         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Scan Location</h2>
                         <code>C:\Users\User\...</code>
                    </div>
                    <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full">
                         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Start Time</h2>
                         <code>05-05-2020 05:05PM</code>
                    </div>
                    <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full">
                         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Duration</h2>
                         <code>00:00:30</code>
                    </div>
               </div>
          </>
     )
}