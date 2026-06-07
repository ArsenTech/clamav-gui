import { ThreatsTable } from "@/data-table/tables/threats";
import { RotateCcw, RotateCw, Trash2 } from "lucide-react"
import { IQuarantineData } from "@/lib/types/data";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useAntivirus } from "@/context/antivirus";

interface Props{
     data: IQuarantineData[],
     isRefreshing: boolean,
     onRefresh: () => void,
     columns: ColumnDef<IQuarantineData>[]
}
export default function QuarantineTable({isRefreshing, data, onRefresh, columns}: Props){
     const {t} = useTranslation("quarantine")
     const {updateQuarantineState} = useAntivirus()
     return (
          <>
          <ButtonGroup>
               <Button onClick={onRefresh} disabled={isRefreshing}>
                    <RotateCw className={cn(isRefreshing && "animate-spin")}/>
                    {isRefreshing ? t("bulk-actions.refresh.loading") : t("bulk-actions.refresh.original")}
               </Button>
               <Button variant="secondary" onClick={()=>updateQuarantineState({popupState: "bulk-delete"})}>
                    <Trash2/> {t("bulk-actions.clear")}
               </Button>
               <Button variant="secondary" onClick={()=>updateQuarantineState({popupState: "bulk-restore"})}>
                    <RotateCcw/> {t("bulk-actions.restore")}
               </Button>
          </ButtonGroup>
          <ThreatsTable
               columns={columns}
               data={data}
               searchColumn="threat_name"
          />
          </>
     )
}