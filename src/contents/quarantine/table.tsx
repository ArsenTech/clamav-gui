import { ThreatsTable } from "@/data-table/tables/threats";
import { RotateCcw, RotateCw, Trash2 } from "lucide-react"
import { IQuarantineData } from "@/lib/types/data";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useQuarantine } from "@/context/antivirus/quarantine";

interface Props{
     data: IQuarantineData[],
     isRefreshing: boolean,
     onRefresh: () => void,
     columns: ColumnDef<IQuarantineData>[]
}
export default function QuarantineTable({isRefreshing, data, onRefresh, columns}: Props){
     const {t} = useTranslation("quarantine",{
          keyPrefix: "bulk-actions"
     })
     const {updateQuarantineState} = useQuarantine()
     return (
          <>
          <ButtonGroup>
               <Button onClick={onRefresh} disabled={isRefreshing}>
                    <RotateCw className={cn(isRefreshing && "animate-spin")}/>
                    {isRefreshing ? t("refresh.loading") : t("refresh.original")}
               </Button>
               <Button variant="secondary" onClick={()=>updateQuarantineState({popupState: "bulk-delete"})}>
                    <Trash2/> {t("clear")}
               </Button>
               <Button variant="secondary" onClick={()=>updateQuarantineState({popupState: "bulk-restore"})}>
                    <RotateCcw/> {t("restore")}
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