import { SCAN_TYPES } from "@/lib/constants";
import { FsOption } from "@/lib/types";
import { ScanType } from "@/lib/types/enums";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";
import { CheckCircle, FilePlus, FolderPlus, Search } from "lucide-react";
import { open } from '@tauri-apps/plugin-dialog';
import { normalizePaths } from "@/lib/helpers";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export default function ScanMenuContent(){
     const navigate = useNavigate();
     const [currScanType, setCurrScanType] = useState<ScanType>(ScanType.None);
     const [path, setPath] = useState<{
          paths: string[],
          scanType: Exclude<ScanType,"main" | "full">
     }>({
          paths: [],
          scanType: ScanType.None
     });
     const hasPath = path.paths.every(p=>p!== "") && path.scanType===currScanType;
     const isFile = currScanType === "file";
     const isCustom = currScanType === "custom";
     const PathIcon = () => {
          if (!hasPath) return isFile ? <FilePlus /> : <FolderPlus />;
          return <CheckCircle className="text-emerald-700 dark:text-emerald-500" />;
     };
     const openDialog = async (type: FsOption) =>{
          const currPath = await open({
               multiple: type==="folder",
               directory: type==='folder',
          });
          if(!currPath) return;
          const paths = normalizePaths(currPath);
          setPath(prev=>({
               ...prev,
               paths,
               scanType: type==="folder" ? ScanType.Custom : type==="file" ? ScanType.File : ScanType.None
          }))
     }
     const handleStartScan = (type: ScanType, pathList: string[]) =>{
          const paths = normalizePaths(pathList);
          const params = new URLSearchParams();
          for(const path of paths)
               params.append("path",path);
          navigate(`${type}?${params.toString()}`)
     }
     const {t} = useTranslation("scan");
     
     return (
          <>
               <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">{t("title")}</h1>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-col">
                    {SCAN_TYPES.map(({type,Icon})=>type!==ScanType.None && (
                         <div key={type} className={cn("p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full flex justify-between items-center hover:border-primary hover:cursor-pointer",currScanType!==type ? "border-border bg-card" : "border-primary bg-primary/5")} onClick={()=>setCurrScanType(type)}>
                              <Icon className="flex-1 size-12 text-primary"/>
                              <div className="flex-3">
                                   <h2 className="text-lg md:text-xl font-medium lg:text-2xl">{t(`scan-type.${type}.name`)}</h2>
                                   <p>{t(`scan-type.${type}.desc`)}</p>
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
                                   {t(`choose.${isFile ? "file" : "folder"}`)}
                              </Button>
                         )}
                         <Button disabled={currScanType==="" || ((currScanType==="custom" || currScanType==="file") && !hasPath)} onClick={()=>handleStartScan(currScanType,path.paths)}>
                              <Search/> {(currScanType!=="custom" && currScanType!=="file") && t("start-scan")}
                         </Button>
                    </ButtonGroup>
               </div>
          </>
     )
}