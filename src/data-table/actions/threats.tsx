import { Button } from "@/components/ui/button";
import { BugOff, FolderOpen, MoreHorizontal, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IThreatsData } from "@/lib/types/data";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { useMemo } from "react";
import { getErrorMessage } from "@/lib/helpers";
import { IFinishScanState, IScanPageState } from "@/lib/types/states";
import { useTranslation } from "react-i18next";
import { useQuarantineCount } from "@/context/quarantine-count";

interface ActionsCellProps{
     threat: IThreatsData,
     setScanState: React.Dispatch<React.SetStateAction<IScanPageState>>,
     setState: (overrides: Partial<IFinishScanState>) => void,
}
export default function ActionsCell({threat, setScanState, setState}: ActionsCellProps){
     const {increaseBy} = useQuarantineCount();
     const {t} = useTranslation("table");
     const {t: messageTxt} = useTranslation("messages")
     const handleQuarantine = async() => {
          try{
               const {filePath, displayName} = threat
               await invoke("quarantine_file",{
                    filePath,
                    threatName: displayName,
                    logId: null,
               })
               increaseBy(1)
               setScanState(prev=>({
                    ...prev,
                    threats: prev.threats.map(val => val.filePath === filePath && val.displayName === displayName ? { ...val, status: "quarantined" } : val)
               }))
               toast.success(messageTxt("quarantine.success"))
          } catch (err){
               toast.error(messageTxt("quarantine.error"),{
                    description: getErrorMessage(err)
               });
          }
     }
     const handleRevealPath = async() => await revealItemInDir(threat.filePath)
     const isResolved = useMemo(()=>["quarantined", "deleted", "safe"].includes(threat.status),[threat.status]);
     return (
          <DropdownMenu>
               <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                         <span className="sr-only">{t("actions.open-menu")}</span>
                         <MoreHorizontal className="h-4 w-4" />
                    </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t("heading.actions")}</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem disabled={isResolved} onClick={handleQuarantine}>
                         <BugOff/>
                         {t("actions.quarantine")}
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={()=>setState({
                         popupState: "delete-threats",
                         currThreat: threat
                    })} disabled={isResolved} >
                         <Trash/>
                         {t("actions.delete")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleRevealPath} disabled={isResolved} >
                         <FolderOpen/>
                         {t("actions.open")}
                    </DropdownMenuItem>
               </DropdownMenuContent>
          </DropdownMenu>
     )
}