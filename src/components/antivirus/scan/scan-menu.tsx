import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScanType } from "@/pages/scan";
import { FileSearch, FolderSearch, LucideProps, Search, SearchCheck } from "lucide-react";
import { useState } from "react";

interface Props{
     handleStartScan: (type: ScanType) => void;
}
interface IScanMenuItem{
     type: ScanType,
     name: string,
     desc: string,
     Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}
const scanTypes: IScanMenuItem[] = [
     {
          type: "main",
          name: "Main Scan",
          desc: "Check common locations for malicious files",
          Icon: Search
     },
     {
          type: "full",
          name: "Full Scan",
          desc: "Scan everything inside this device (might take a while)",
          Icon: SearchCheck
     },
     {
          type: "custom",
          name: "Custom Scan",
          desc: "Choose a folder to scan",
          Icon: FolderSearch
     },
     {
          type: "file",
          name: "File Scan",
          desc: "Choose a file to scan",
          Icon: FileSearch
     }
]
export default function ScanMenu({handleStartScan}: Props){
     const [currScanType, setCurrScanType] = useState<ScanType>("")
     return (
          <>
          <div className="flex justify-center items-center gap-2 flex-col">
               {scanTypes.map(({type,name,desc,Icon})=>(
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