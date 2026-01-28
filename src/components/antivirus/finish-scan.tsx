import { ThreatsTable } from "@/components/data-table/tables/threats";
import { Button } from "@/components/ui/button";
import { BugOff, LogOut, ShieldAlert, ShieldCheck, ShieldX, Timer, Trash } from "lucide-react";
import { useNavigate } from "react-router";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GET_THREATS_COLS } from "@/components/data-table/columns/threats";
import { useMemo, useState, useTransition } from "react";
import Popup from "@/components/popup";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { formatDuration, getExitText } from "@/lib/helpers";
import { exit } from "@tauri-apps/plugin-process";
import { IFinishScanState, IScanPageState } from "@/lib/types/states";
import { INITIAL_FINISH_SCAN_STATE } from "@/lib/constants/states";
import useSettings from "@/hooks/use-settings";

interface Props{
     setScanState: React.Dispatch<React.SetStateAction<IScanPageState>>,
     scanState: IScanPageState
     isStartup: boolean,
}
export default function ScanFinishResult({setScanState, isStartup, scanState}: Props){
     const navigate = useNavigate();
     const {settings} = useSettings();
     const [isPending, startTransition] = useTransition()
     const [finishScanState, setFinishScanState] = useState<IFinishScanState>(INITIAL_FINISH_SCAN_STATE)
     const setState = (overrides: Partial<IFinishScanState>) =>
          setFinishScanState(prev=>({
               ...prev,
               ...overrides
          }));
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
     const handlePrimaryAction = async () => {
          if (isStartup) {
               await exit(0);
          } else {
               navigate("/");
          }
     };
     const {errMsg, exitCode, threats, duration} = scanState;
     const isResolved = useMemo(() =>threats.some(t =>["quarantined", "deleted"].includes(t.status)),[threats]);
     const {isOpenDelete, bulkDelete} = finishScanState
     return (errMsg && errMsg.trim()!=="") ? (
          <>
               <ShieldX className="size-32 text-destructive"/>
               <h2 className="text-lg md:text-2xl font-medium">Scan Failed</h2>
               <h2 className="text-lg sm:text-xl font-semibold flex items-center justify-center gap-2.5 w-fit"><Timer className="text-primary"/>{formatDuration(duration)}</h2>
               <p>{errMsg}</p>
               <Button onClick={handlePrimaryAction}>
                    {isStartup && <LogOut/>}
                    {isStartup ? "Close" : "Back to the overview"}
               </Button>
               <p className="text-muted-foreground">{getExitText(exitCode,"scan")}</p>
          </>
     )  : threats.length<=0 ? (
          <>
               <ShieldCheck className="size-32 text-emerald-700 dark:text-emerald-500"/>
               <h2 className="text-lg md:text-2xl font-medium">No items detected!</h2>
               <h2 className="text-lg sm:text-xl font-semibold flex items-center justify-center gap-2.5 w-fit"><Timer className="text-primary"/>{formatDuration(duration)}</h2>
               <Button onClick={handlePrimaryAction}>
                    {isStartup && <LogOut/>}
                    {isStartup ? "Close" : "Back to the overview"}
               </Button>
               <p className="text-muted-foreground">{getExitText(exitCode,"scan")}</p>
          </>
     ) : (
          <>
               <ShieldAlert className="size-32 text-destructive"/>
               <h2 className="text-lg md:text-2xl font-medium">{threats.length} {threats.length<=1 ? "threat" : "threats"} require attention</h2>
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
                                   {isPending ? "Please wait..." : isResolved ? "Successfully Resolved!" : "Resolve"}
                              </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={handleBulkQuarantine}>
                                   <BugOff/> Quarantine All
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={()=>setState({bulkDelete: true})}>
                                   <Trash className="text-destructive"/> Delete All
                              </DropdownMenuItem>
                         </DropdownMenuContent>
                    </DropdownMenu>
                    <Button onClick={handlePrimaryAction} variant="secondary" disabled={!isResolved}>
                         {isStartup && <LogOut/>}
                         {isStartup ? "Close" : "Back to the overview"}
                    </Button>
               </ButtonGroup>
               <p className="text-muted-foreground">{getExitText(exitCode,"scan")}</p>
               <Popup
                    open={isOpenDelete}
                    onOpen={isOpenDelete=>setState({isOpenDelete})}
                    title="Are you sure to delete this file permanently?"
                    description="The process can't be undone."
                    submitTxt="Delete"
                    closeText="Cancel"
                    submitEvent={handleDelete}
               />
               <Popup
                    open={bulkDelete}
                    onOpen={bulkDelete=>setState({bulkDelete})}
                    title="This will permanently delete all detected threats."
                    description="Continue?"
                    submitTxt="Delete"
                    closeText="Cancel"
                    submitEvent={handleBulkDelete}
               />
          </>
     )
}