import Popup from "@/components/popup";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { SCAN_TYPES } from "@/lib/constants";
import { ScanType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Bug, Clock, Folder, Pause, Search, Square, Timer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

interface Props{
     scanType: ScanType,
     onStop: () => void
}
export default function ScanProcess({scanType, onStop}: Props){
     const scanTypeName = useMemo(()=>SCAN_TYPES.find(val=>val.type===scanType)?.name,[scanType])
     if(scanType==="") return null;
     const [isOpen, setIsOpen] = useState(false);
     const [isPaused, setIsPaused] = useState(false);
     const handleStopScan = () => {
          onStop();
          setIsOpen(false);
     }
     useEffect(()=>{
          (async()=>{
               try{
                    await invoke(`start_${scanType}_scan`)
               } catch {
                    console.error("Command not found")
               }
          })()
     },[])
     return (
          <>
               <p className="text-muted-foreground font-medium">Scan Type: {scanTypeName}</p>
               <Progress value={50}/>
               <p className="text-2xl font-semibold text-center flex justify-center items-center gap-3"><Spinner className={cn("size-9 text-muted-foreground",isPaused && "paused")}/> 50% - 12345 files scanned</p>
               <ButtonGroup className="w-full">
                    <Button className="flex-1" onClick={()=>setIsPaused(!isPaused)}>
                         {isPaused ? <Search/> : <Pause/>}
                         {isPaused ? "Resume" : "Pause"} the Scan
                    </Button>
                    <Button variant="secondary" className="flex-1" onClick={()=>setIsOpen(true)}><Square/> Stop the Scan</Button>
               </ButtonGroup>
               <div className="flex justify-center items-center gap-2 flex-col">
                    <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full">
                         <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2.5 border-b pb-0.5 mb-2 w-fit"><Folder className="text-primary"/> Current Location</h2>
                         <code>C:\Users\User\...</code>
                    </div>
                    <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full">
                         <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2.5 border-b pb-0.5 mb-2 w-fit"><Bug className="text-primary"/> Findings</h2>
                         <p>2 Threats</p>
                    </div>
                    <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full">
                         <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2.5 border-b pb-0.5 mb-2 w-fit"><Folder className="text-primary"/> Scan Location</h2>
                         <code>C:\Users\User\...</code>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
                         <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full">
                              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2.5 border-b pb-0.5 mb-2 w-fit"><Clock className="text-primary"/> Start Time</h2>
                              <code>05-05-2020 05:05PM</code>
                         </div>
                         <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full">
                              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2.5 border-b pb-0.5 mb-2 w-fit"><Timer className="text-primary"/> Duration</h2>
                              <code>00:00:30</code>
                         </div>
                    </div>
               </div>
               <Popup
                    open={isOpen}
                    onOpen={setIsOpen}
                    title={`Are you sure to stop the ${scanTypeName} process?`}
                    description="This will cancel all the scan process and return to the scan options menu."
                    submitTxt="Stop"
                    closeText="Cancel"
                    submitEvent={handleStopScan}
               />
          </>
     )
}