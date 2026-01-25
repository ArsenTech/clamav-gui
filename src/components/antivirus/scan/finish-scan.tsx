import { ThreatsTable } from "@/components/data-table/tables/threats";
import { Button } from "@/components/ui/button";
import { BugOff, EyeOff, LogOut, ShieldAlert, ShieldCheck, ShieldX, Trash } from "lucide-react";
import { useNavigate } from "react-router";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { THREATS_COLS } from "@/components/data-table/columns/threats";
import { IThreatsData } from "@/lib/types";
import { useMemo, useState, useTransition } from "react";
import Popup from "@/components/popup";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { getExitText } from "@/lib/helpers";
import { exit } from "@tauri-apps/plugin-process";

interface Props{
     setThreats: React.Dispatch<React.SetStateAction<IThreatsData[]>>,
     threats: IThreatsData[],
     durationElem: React.JSX.Element,
     exitCode: number,
     isStartup: boolean,
     errMsg?: string
}
export default function ScanFinishResult({threats,durationElem,setThreats, exitCode, isStartup, errMsg}: Props){
     const navigate = useNavigate();
     const [isOpenDeletion, setIsOpenDeletion] = useState(false);
     const [isPending, startTransition] = useTransition()
     const [finishScanState, setFinishScanState] = useState<{
          currThreat: IThreatsData | null,
          isOpen: boolean
     }>({
          currThreat: null,
          isOpen: false
     })
     const setState = (overrides: Partial<typeof finishScanState>) =>
          setFinishScanState(prev=>({
               ...prev,
               ...overrides
          }));
     const {isOpen} = finishScanState;
     const handleDelete = async() => {
          try{
               if(!finishScanState.currThreat) return;
               const {filePath, displayName} = finishScanState.currThreat
               await invoke("remove_file",{
                    filePath,
                    logId: null,
               })
               setThreats(prev=>prev.map(val =>
                    val.filePath === filePath &&
                    val.displayName === displayName
                         ? { ...val, status: "deleted" }
                         : val
               ));
               toast.success("Threat deleted permanently!")
          } catch (e){
               toast.error("Failed to delete threat");
               console.error(e);
          } finally {
               setState({
                    currThreat: null,
                    isOpen: false
               })
          }
     }
     const handleBulkQuarantine = () => {
          startTransition(async()=>{
               try {
                    const targets = threats
                         .filter(t => t.status === "detected")
                         .map(t => [t.filePath, t.displayName]);
                    await invoke("quarantine_all", { files: targets });
                    setThreats(prev =>
                         prev.map(t =>
                         t.status === "detected"
                              ? { ...t, status: "quarantined" }
                              : t
                         )
                    );
                    toast.success("All threats quarantined");
               } catch {
                    toast.error("Failed to quarantine all threats");
               }
          })
     }
     const handleBulkDeletion = () => {
          setIsOpenDeletion(false);
          startTransition(async()=>{
               try {
                    const paths = threats
                         .filter(t => t.status === "detected")
                         .map(t => t.filePath);
                    await invoke("delete_all", { files: paths });
                    setThreats(prev =>
                         prev.map(t =>
                         t.status === "detected"
                              ? { ...t, status: "deleted" }
                              : t
                         )
                    );
                    toast.success("All threats deleted");
               } catch {
                    toast.error("Failed to delete all threats");
               } 
          })
     }
     const handleBulkMarkSafe = () => {
          setThreats(prev =>
               prev.map(t =>
               t.status === "detected"
                    ? { ...t, status: "safe" }
                    : t
               )
          );
          toast.success("All threats marked as safe!")
          // TODO: Exclude the Threat
     }
     const handlePrimaryAction = async () => {
          if (isStartup) {
               await exit(0);
          } else {
               navigate("/");
          }
     };
     const isResolved = useMemo(() =>threats.every(t =>["quarantined", "deleted", "safe"].includes(t.status)),[threats]);
     return (errMsg && errMsg.trim()!=="") ? (
          <>
               <ShieldX className="size-32 text-destructive"/>
               <h2 className="text-lg md:text-2xl font-medium">Scan Failed</h2>
               {durationElem}
               <p>{errMsg}</p>
               <Button onClick={handlePrimaryAction}>
                    {isStartup && <LogOut/>}
                    {isStartup ? "Close" : "Back to the overview"}
               </Button>
               <p className="text-muted-foreground">{getExitText(exitCode,"scan")}</p>
          </>
     )  : threats.length<=0 ? (
          <>
               <ShieldCheck className="size-32 text-emerald-700"/>
               <h2 className="text-lg md:text-2xl font-medium">No items detected!</h2>
               {durationElem}
               <Button onClick={handlePrimaryAction}>
                    {isStartup && <LogOut/>}
                    {isStartup ? "Close" : "Back to the overview"}
               </Button>
               <p className="text-muted-foreground">{getExitText(exitCode,"scan")}</p>
          </>
     ) : (
          <>
               <ShieldAlert className="size-32 text-red-700"/>
               <h2 className="text-lg md:text-2xl font-medium">{threats.length} {threats.length<=1 ? "threat" : "threats"} require attention</h2>
               {durationElem}
               <ThreatsTable
                    columns={THREATS_COLS(setThreats,setState)}
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
                              <DropdownMenuItem onClick={handleBulkMarkSafe}>
                                   <EyeOff/> Mark All Safe
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={()=>setIsOpenDeletion(true)}>
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
                    open={isOpen}
                    onOpen={isOpen=>setState({isOpen})}
                    title="Are you sure to delete this file permanently?"
                    description="The process can't be undone."
                    submitTxt="Delete"
                    closeText="Cancel"
                    submitEvent={handleDelete}
               />
               <Popup
                    open={isOpenDeletion}
                    onOpen={setIsOpenDeletion}
                    title="This will permanently delete all detected threats."
                    description="Continue?"
                    submitTxt="Delete"
                    closeText="Cancel"
                    submitEvent={handleBulkDeletion}
               />
          </>
     )
}