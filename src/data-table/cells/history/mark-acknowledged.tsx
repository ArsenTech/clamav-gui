import { CheckCircle } from "lucide-react";
import { IHistoryData } from "@/lib/types/data";
import { getErrorMessage } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { IHistoryPageState } from "@/lib/types/states";
import { useTranslation } from "react-i18next";

interface MarkAcknowledgedCellProps{
     item: IHistoryData<"state">
     setHistoryState: React.Dispatch<React.SetStateAction<IHistoryPageState>>,
}
export default function MarkAcknowledgedCell({item, setHistoryState}: MarkAcknowledgedCellProps){
     const {t} = useTranslation("table")
     const {t: messageTxt} = useTranslation("messages")
     const markAsAcknowledged = async () => {
          try{
               await invoke("mark_as_acknowledged", {
                    id: item.id,
                    date: item.timestamp.split("T")[0]
               });
               setHistoryState(prev=>({
                    ...prev,
                    data: prev.data.map(val=>({
                         ...val,
                         status: val.id===item.id ? "acknowledged" : val.status
                    }))
               }))
               toast.success(messageTxt("acknowledge-history.success"))
          } catch (err){
               toast.error(messageTxt("acknowledge-history.error"),{
                    description: getErrorMessage(err)
               });
          }
     }
     return (
          <Button variant="ghost" size="icon" title={t("mark-as-acknowledged")} onClick={markAsAcknowledged} disabled={item.status==="acknowledged"}>
               <CheckCircle/>
          </Button>
     )
}