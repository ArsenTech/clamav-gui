import { FileText, List, MoreHorizontal, ScrollText } from "lucide-react";
import { IHistoryData } from "@/lib/types/data";
import { getErrorMessage } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "react-router";
import { IHistoryPageState } from "@/lib/types/states";
import { useTranslation } from "react-i18next";

interface ActionsCellProps{
     item: IHistoryData<"state">
     setHistoryState: React.Dispatch<React.SetStateAction<IHistoryPageState>>,
}
export default function ActionsCell({item, setHistoryState}: ActionsCellProps){
     const {t} = useTranslation("table")
     const {t: messageTxt} = useTranslation("messages")
     const revealLog = async()=>{
          if(!item.logId || !item.category) return;
          try{
               await invoke("reveal_log",{
                    category: item.category,
                    id: item.logId
               })
          } catch(err){
               toast.error(messageTxt("log-reveal-error"),{
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
                    <DropdownMenuItem disabled={!item.category || !item.details} onClick={()=>setHistoryState(prev=>({
                         ...prev,
                         showDetails: true,
                         details: item.details
                    }))}>
                         <List/>
                         {t("actions.view-details")}
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={!item.logId || !item.category} asChild>
                         <Link to={`/history/${item.logId}?category=${item.category}`}>
                              <ScrollText/>
                              {t("actions.view-log")}
                         </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={revealLog} disabled={!item.logId || !item.category}>
                         <FileText />
                         {t("actions.reveal-log")}
                    </DropdownMenuItem>
               </DropdownMenuContent>
          </DropdownMenu>
     )
}