import { Button } from "@/components/ui/button";
import { MoreHorizontal, RotateCcw, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IQuarantineData } from "@/lib/types/data";
import { useTranslation } from "react-i18next";
import { useQuarantine } from "@/context/antivirus/quarantine";

interface ActionsCellProps{
     threat: IQuarantineData
}
export default function ActionsCell({threat}: ActionsCellProps){
     const {updateQuarantineState} = useQuarantine()
     const {t} = useTranslation("table");
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
                    <DropdownMenuItem onClick={()=>updateQuarantineState({
                         id: threat.id,
                         popupState: "restore"
                    })}>
                         <RotateCcw/>
                         {t("actions.restore")}
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={()=>updateQuarantineState({
                         id: threat.id,
                         popupState: "delete"
                    })}>
                         <Trash/>
                         {t("actions.delete")}
                    </DropdownMenuItem>
               </DropdownMenuContent>
          </DropdownMenu>
     )
}