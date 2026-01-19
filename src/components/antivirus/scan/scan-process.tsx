import Popup from "@/components/popup";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { SCAN_TYPES } from "@/lib/constants";
import { ScanType } from "@/lib/types";
import { Bug, Clock, Dot, Folder, SearchCheck, ShieldAlert, ShieldCheck, Square } from "lucide-react";
import { useMemo, useRef, useState } from "react";

interface Props{
     scanType: ScanType,
     onStop: () => void,
     threatsCount: number,
     currLocation: string,
     filesCount: number,
     totalFiles: number,
     scanPaths?: string[],
}

export default function ScanProcess({scanType, onStop, threatsCount, currLocation, filesCount, totalFiles, scanPaths}: Props){
     const scanTypeName = useMemo(()=>SCAN_TYPES.find(val=>val.type===scanType)?.name,[scanType])
     const [isOpen, setIsOpen] = useState(false);
     const dateRef = useRef<Date>(new Date(Date.now()))
     const handleStopScan = () => {
          onStop();
          setIsOpen(false);
     }
     const percentage = useMemo(()=>totalFiles>0 ? Math.min(100,Math.floor((filesCount/totalFiles)*100)) : 0,[filesCount,totalFiles])
     return (
          <>
               <p className="text-muted-foreground font-medium">Scan Type: {scanTypeName}</p>
               {scanType!=="full" ? (
                    <>
                    <Progress value={percentage}/>
                    <p className="text-2xl font-semibold text-center flex justify-center items-center gap-3"><Spinner className="size-9 text-muted-foreground"/> {filesCount<=0 ? "Preparing Scan..." : `${percentage}% - ${filesCount}/${totalFiles} files scanned`}</p>
                    </>
               ) : (
                    <>
                    <p className="text-2xl font-semibold text-center flex justify-center items-center gap-1.5"><Spinner className="size-9 text-muted-foreground"/> {filesCount<=0 ? "Preparing scan…" : (
                         <>
                              Scanning... <Dot/> {filesCount} files scanned
                         </>
                    )}</p>
                    <p className="text-muted-foreground">Full scans may take a while depending on disk size.</p>
                    </>
               )}
               <div className="flex justify-center items-center gap-2 flex-col">
                    {currLocation.trim() !== "" && (
                         <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full">
                              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2.5 border-b pb-0.5 mb-2 w-fit"><SearchCheck className="text-primary"/> Currently scanned</h2>
                              <code className="min-h-6 break-all">{currLocation}</code>
                         </div>
                    )}
                    {(scanPaths && scanPaths.length>0) && (
                         <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full">
                              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2.5 border-b pb-0.5 mb-2 w-fit"><Folder className="text-primary"/> Scan Location</h2>
                              <ul>
                                   {scanPaths.map((path,i)=>(
                                        <li key={`location-${i+1}`} className="brek-all font-mono">{path}</li>
                                   ))}
                              </ul>
                         </div>
                    )}
                    <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full">
                         <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2.5 border-b pb-0.5 mb-2 w-fit"><Bug className="text-primary"/> Findings</h2>
                         <p className="flex items-center gap-2 min-h-6">{threatsCount<=0 ? <ShieldCheck className="text-emerald-700"/> : <ShieldAlert className="text-destructive"/>} {threatsCount} Threats</p>
                    </div>
                    <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full">
                         <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2.5 border-b pb-0.5 mb-2 w-fit"><Clock className="text-primary"/> Start Time</h2>
                         <code className="min-h-6">{dateRef.current.toLocaleString()}</code>
                    </div>
                    <Button className="flex-1" onClick={()=>setIsOpen(true)}><Square/> Stop the Scan</Button>
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