import { ThreatsTable } from "@/components/data-table/tables/threats";
import { RotateCcw, RotateCw, Trash2 } from "lucide-react"
import { IQuarantineData } from "@/lib/types/data";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

interface Props{
     data: IQuarantineData<"state">[],
     isRefreshing: boolean,
     onRefresh: () => void,
     onBulkClear: () => void,
     onBulkRestore: () => void,
     columns: ColumnDef<IQuarantineData<"state">>[]
}
export default function QuarantineTable({isRefreshing,data,onRefresh,onBulkClear,onBulkRestore,columns}: Props){
     return (
          <>
          <ButtonGroup>
               <Button onClick={onRefresh} disabled={isRefreshing}>
                    <RotateCw className={cn(isRefreshing && "animate-spin")}/>
                    {isRefreshing ? "Refreshing..." : "Refresh"}
               </Button>
               <Button variant="secondary" onClick={onBulkClear}>
                    <Trash2/> Clear All
               </Button>
               <Button variant="secondary" onClick={onBulkRestore}>
                    <RotateCcw/> Restore All
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