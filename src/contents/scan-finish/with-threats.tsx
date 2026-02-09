import { ThreatsTable } from "@/components/data-table/tables/threats";
import { Button } from "@/components/ui/button";
import { BugOff, LogOut, ShieldAlert, ShieldCheck, Timer, Trash } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GET_THREATS_COLS } from "@/components/data-table/columns/threats";
import { useMemo, useTransition } from "react";
import Popup from "@/components/popup";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { formatDuration } from "@/lib/helpers/formating";
import { IFinishScanState, IScanPageState } from "@/lib/types/states";
import { INITIAL_FINISH_SCAN_STATE } from "@/lib/constants/states";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";

interface Props{
     setScanState: React.Dispatch<React.SetStateAction<IScanPageState>>,
     scanState: IScanPageState
     isStartup: boolean,
     handlePrimaryAction: () => void
     setState: (overrides: Partial<IFinishScanState>) => void,
     finishScanState: IFinishScanState
}
export default function ScanFinishedTable({setScanState, isStartup, scanState, handlePrimaryAction, finishScanState, setState}: Props){
     const {settings} = useSettings();
     const [isPending, startTransition] = useTransition()
     const handleDelete = async() => {
          try{
               if(!finishScanState.currThreat) return;
               const {filePath, displayName} = finishScanState.currThreat
               await invoke("remove_file",{
                    filePath,
                    logId: null,
               })
               setScanState(prev=>({
                    ...prev,
                    threats: prev.threats.map(val => val.filePath === filePath && val.displayName === displayName ? { ...val, status: "deleted" } : val)
               }))
               toast.success("Threat deleted permanently!")
          } catch (e){
               toast.error("Failed to delete threat");
               console.error(e);
          } finally {
               setState(INITIAL_FINISH_SCAN_STATE)
          }
     }
     const handleBulkQuarantine = () => {
          startTransition(async()=>{
               try {
                    const targets = scanState.threats
                         .filter(t => t.status === "detected")
                         .map(t => [t.filePath, t.displayName]);
                    await invoke("quarantine_all", { files: targets });
                    setScanState(prev=>({
                         ...prev,
                         threats: prev.threats.map(t =>t.status === "detected" ? { ...t, status: "quarantined" } : t)
                    }))
                    toast.success("All threats quarantined");
               } catch {
                    toast.error("Failed to quarantine all threats");
               }
          })
     }
     const handleBulkDelete = () => {
          setState({bulkDelete: false})
          startTransition(async()=>{
               try {
                    const paths = scanState.threats
                         .filter(t => t.status === "detected")
                         .map(t => t.filePath);
                    await invoke("delete_all", { files: paths });
                    setScanState(prev=>({
                         ...prev,
                         threats: prev.threats.map(t =>t.status === "detected" ? { ...t, status: "deleted" } : t)
                    }))
                    toast.success("All threats deleted");
               } catch {
                    toast.error("Failed to delete all threats");
               } 
          })
     }
     const {exitCode, threats, duration} = scanState;
     const isResolved = useMemo(() =>threats.some(t =>["quarantined", "deleted"].includes(t.status)),[threats]);
     const {isOpenDelete, bulkDelete} = finishScanState;
     const {t} = useTranslation("scan");
     const exitCodes = t("exit-code",{returnObjects: true})
     return (
          <>
               <ShieldAlert className="size-32 text-destructive"/>
               <h2 className="text-lg md:text-2xl font-medium">{t("finished.with-threats",{count: threats.length})}</h2>
               <h2 className="text-lg sm:text-xl font-semibold flex items-center justify-center gap-2.5 w-fit"><Timer className="text-primary"/>{formatDuration(duration)}</h2>
               <ThreatsTable
                    columns={GET_THREATS_COLS(setScanState,setState,settings.developerMode)}
                    data={threats}
               />
               <ButtonGroup>
                    <DropdownMenu>
                         <DropdownMenuTrigger asChild disabled={isResolved}>
                              <Button>
                                   {isPending ? <Spinner/> : <ShieldCheck/>}
                                   {isPending ? t("please-wait") : isResolved ? t("resolve.success") : t("resolve.title")}
                              </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={handleBulkQuarantine}>
                                   <BugOff/> {t("resolve.quarantine")}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={()=>setState({bulkDelete: true})}>
                                   <Trash className="text-destructive"/> {t("resolve.delete")}
                              </DropdownMenuItem>
                         </DropdownMenuContent>
                    </DropdownMenu>
                    <Button onClick={handlePrimaryAction}>
                         <LogOut/>
                         {isStartup ? t("close") : t("back-to-overview")}
                    </Button>
               </ButtonGroup>
               <p className="text-muted-foreground">{t("exit-code-formatting",{
                    msg: exitCodes[exitCode] ?? t("exit-code-fallback"),
                    exitCode
               })}</p>
               <Popup
                    open={isOpenDelete}
                    onOpen={isOpenDelete=>setState({isOpenDelete})}
                    title={t("confirmation.title.delete")}
                    description={t("confirmation.desc.action-undone")}
                    submitTxt={t("confirmation.delete")}
                    closeText={t("confirmation.cancel")}
                    submitEvent={handleDelete}
                    type="danger"
               />
               <Popup
                    open={bulkDelete}
                    onOpen={bulkDelete=>setState({bulkDelete})}
                    title={t("confirmation.title.clear")}
                    description={t("confirmation.desc.action-undone")}
                    submitTxt={t("confirmation.delete")}
                    closeText={t("confirmation.cancel")}
                    submitEvent={handleBulkDelete}
                    type="danger"
               />
          </>
     )
}