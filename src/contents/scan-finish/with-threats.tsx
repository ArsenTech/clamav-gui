import { ThreatsTable } from "@/data-table/tables/threats";
import { Button } from "@/components/ui/button";
import { BugOff, LogOut, ShieldAlert, ShieldCheck, Timer, Trash } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GET_THREATS_COLS } from "@/data-table/columns/threats";
import { useMemo, useTransition } from "react";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import LoadingButton from "@/components/loading-button";
import { formatDuration } from "@/lib/helpers/formating";
import { IFinishScanState, IScanPageState } from "@/lib/types/states";
import { INITIAL_FINISH_SCAN_STATE } from "@/lib/constants/states";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";
import { useQuarantineCount } from "@/context/quarantine-count";
import ConfirmationMessage from "@/components/popup/confirm";
import { ScanFinishConfState } from "@/lib/types";
import { getErrorMessage } from "@/lib/helpers";

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
     const {increaseBy} = useQuarantineCount()
     const [isPending, startTransition] = useTransition()
     const {t: messageTxt} = useTranslation("messages")
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
               toast.success(messageTxt("threat-deleted.success"))
          } catch (err){
               toast.error(messageTxt("threat-deleted.error"),{
                    description: getErrorMessage(err)
               });
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
                    increaseBy(targets.length)
                    setScanState(prev=>({
                         ...prev,
                         threats: prev.threats.map(t =>t.status === "detected" ? { ...t, status: "quarantined" } : t)
                    }))
                    toast.success(messageTxt("threat-quarantined.success"));
               } catch (err) {
                    toast.error(messageTxt("threat-quarantined.error"),{
                         description: getErrorMessage(err)
                    });
               }
          })
     }
     const handleBulkDelete = () => {
          if(isPending) return;
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
                    toast.success(messageTxt("threat-bulk-delete.success"));
               } catch (err) {
                    toast.error(messageTxt("threat-bulk-delete.error"),{
                         description: getErrorMessage(err)
                    });
               } finally {
                    setState({popupState: ""})
               }
          })
     }
     const {exitCode, threats, duration} = scanState;
     const isResolved = useMemo(() =>threats.some(t =>["quarantined", "deleted"].includes(t.status)),[threats]);
     const {popupState} = finishScanState;
     const {t} = useTranslation("scan");
     const exitCodes = t("exit-code",{returnObjects: true})
     const ACTIONS = {
          "delete-threats": handleDelete,
          "clear-threats": handleBulkDelete
     } as const
     const handleConfirm = async() => {
          if(popupState) await ACTIONS[popupState]()
     }
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
                              <LoadingButton
                                   isLoading={isPending}
                                   loaderText={t("please-wait")}
                              >
                                   <ShieldCheck/>
                                   {isResolved ? t("resolve.success") : t("resolve.title")}
                              </LoadingButton>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={handleBulkQuarantine}>
                                   <BugOff/> {t("resolve.quarantine")}
                              </DropdownMenuItem>
                              <DropdownMenuItem variant="destructive" onClick={()=>setState({popupState: "clear-threats"})}>
                                   <Trash/>
                                   {t("resolve.delete")}
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
               <ConfirmationMessage
                    state={popupState}
                    submitAction={popupState==="clear-threats" ? "clear" : "delete"}
                    submitEvent={handleConfirm}
                    type="danger"
                    onOpenChange={(state)=>setState({ popupState: state as "" | ScanFinishConfState})}
               />
          </>
     )
}