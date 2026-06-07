import { Button } from "@/components/ui/button";
import { FileText, MoreHorizontal, ScrollText, Search, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ISchedulerData } from "@/lib/types/data";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/lib/helpers";
import { useAntivirus } from "@/context/antivirus";

interface ActionsCellProps{
     item: ISchedulerData<"state">,
}
export default function ActionsCell({item}: ActionsCellProps){
     const {t} = useTranslation("table")
     const {t: messageTxt} = useTranslation("messages")
     const {updateSchedulerState} = useAntivirus()
     const revealLog = async()=>{
          if(!item.log_id) return;
          try{
               await invoke("reveal_log",{
                    category: "scheduler",
                    id: item.log_id
               })
          } catch(err){
               toast.error(messageTxt("log-reveal-error"),{
                    description: getErrorMessage(err)
               });
          }
     }
     const handleRunScan = async()=>{
          try{
               await invoke("run_job_now",{
                    taskName: item.id
               });
               toast.success(messageTxt("trigger-scan.success"))
          } catch (err){
               toast.error(messageTxt("trigger-scan.error"),{
                    description: getErrorMessage(err)
               });
          }
     }
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
                    <DropdownMenuItem onClick={handleRunScan}>
                         <Search/>
                         {t("actions.scan-now")}
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={!item.log_id} asChild>
                         <Link to={`/scheduler/${item.log_id}`}>
                              <ScrollText/>
                              {t("actions.view-log")}
                         </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={!item.log_id} onClick={revealLog}>
                         <FileText />
                         {t("actions.reveal-log")}
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={()=>updateSchedulerState({
                         popupState: "delete-job",
                         job_id: item.id
                    })}>
                         <Trash2/>
                         {t("actions.remove-job")}
                    </DropdownMenuItem>
               </DropdownMenuContent>
          </DropdownMenu>
     )
}