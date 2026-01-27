import { ThreatsTable } from "@/components/data-table/tables/threats";
import { RotateCcw, RotateCw, Trash2 } from "lucide-react"
import { GET_QUARANTINE_COLS } from "@/components/data-table/columns/quarantine";
import { IQuarantineData } from "@/lib/types";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IQuarantineState } from "@/lib/types/states";
import useSettings from "@/hooks/use-settings";

interface Props{
     data: IQuarantineData<"state">[],
     isRefreshing: boolean,
     fetchData: () => void,
     setState: (overrides: Partial<IQuarantineState>) => void
}
export default function QuarantineTable({isRefreshing,data,fetchData,setState}: Props){
     const {settings} = useSettings();
     return (
          <>
          <ButtonGroup>
               <Button onClick={fetchData} disabled={isRefreshing}>
                    <RotateCw className={cn(isRefreshing && "animate-spin")}/>
                    {isRefreshing ? "Refreshing..." : "Refresh"}
               </Button>
               <Button variant="secondary" onClick={()=>setState({ bulkDelete: true })}>
                    <Trash2/> Clear All
               </Button>
               <Button variant="secondary" onClick={()=>setState({ bulkRestore: true })}>
                    <RotateCcw/> Restore All
               </Button>
          </ButtonGroup>
          <ThreatsTable
               columns={GET_QUARANTINE_COLS(setState,settings.developerMode)}
               data={data}
               searchColumn="threat_name"
          />
          </>
     )
}