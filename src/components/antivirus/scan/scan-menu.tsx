import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { SCAN_TYPES } from "@/lib/constants";
import { ScanType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle, FilePlus, FolderPlus, Search } from "lucide-react";
import { useState } from "react";
import { open } from '@tauri-apps/plugin-dialog';
import { normalizePaths } from "@/lib/helpers";

interface Props{
     handleStartScan: (type: ScanType, paths?: string[]) => void;
}
export default function ScanMenu({handleStartScan}: Props){
     const [currScanType, setCurrScanType] = useState<ScanType>("");
     const [path, setPath] = useState<{
          paths: string[],
          scanType: "file" | "custom" | ""
     }>({
          paths: [],
          scanType: ""
     });
     const hasPath = path.paths.every(p=>p!== "") && path.scanType===currScanType;
     const isFile = currScanType === "file";
     const isCustom = currScanType === "custom";
     const PathIcon = () => {
          if (!hasPath) return isFile ? <FilePlus /> : <FolderPlus />;
          return <CheckCircle className="text-emerald-600" />;
     };
     const openDialog = async (type: "file" | "folder") =>{
          const currPath = await open({
               multiple: type==="folder",
               directory: type==='folder',
          });
          if(!currPath) return;
          const paths = normalizePaths(currPath);
          setPath(prev=>({
               ...prev,
               paths,
               scanType: type==="folder" ? "custom" : type
          }))
     }
     return (
          <>
          <div className="flex justify-center items-center gap-2 flex-col">
               {SCAN_TYPES.map(({type,name,desc,Icon})=>(
                    <div key={type} className={cn("p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full flex justify-between items-center hover:border-primary hover:cursor-pointer",currScanType!==type ? "border-border bg-card" : "border-primary bg-primary/5")} onClick={()=>setCurrScanType(type)}>
                         <Icon className="flex-1 size-12 text-primary"/>
                         <div className="flex-3">
                              <h2 className="text-lg md:text-xl font-medium lg:text-2xl">{name}</h2>
                              <p>{desc}</p>
                         </div>
                    </div>
               ))}
               <ButtonGroup>
                    {(currScanType==="custom" || currScanType==="file") && (
                         <Button
                              variant={hasPath ? "secondary" : "default"}
                              onClick={() => openDialog(isCustom ? "folder" : "file")}
                         >
                              <PathIcon />
                              Choose a {isFile ? "file" : "folder"} path
                         </Button>
                    )}
                    <Button disabled={currScanType==="" || ((currScanType==="custom" || currScanType==="file") && !hasPath)} onClick={()=>handleStartScan(currScanType,path.paths)}><Search/> {(currScanType!=="custom" && currScanType!=="file") ? "Start Scanning" : ""}</Button>
               </ButtonGroup>
          </div>
          </>
     )
}