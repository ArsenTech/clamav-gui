import { Button } from "@/components/ui/button";
import { SCAN_TYPES } from "@/lib/constants";
import { ScanType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Props{
     handleStartScan: (type: ScanType) => void;
}
export default function ScanMenu({handleStartScan}: Props){
     const [currScanType, setCurrScanType] = useState<ScanType>("")
     return (
          <>
          <div className="flex justify-center items-center gap-2 flex-col">
               {SCAN_TYPES.map(({type,name,desc,Icon})=>(
                    <div key={type} className={cn("p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full flex justify-between items-center",currScanType!==type ? "border-border bg-card" : "border-primary bg-primary/5")} onClick={()=>setCurrScanType(type)}>
                         <Icon className="flex-1 size-12 text-primary"/>
                         <div className="flex-3">
                              <h2 className="text-lg md:text-xl font-medium lg:text-2xl">{name}</h2>
                              <p>{desc}</p>
                         </div>
                    </div>
               ))}
               <Button disabled={currScanType===""} onClick={()=>handleStartScan(currScanType)}>Start Scanning</Button>
          </div>
          </>
     )
}