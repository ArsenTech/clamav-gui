import { Button } from "@/components/ui/button";
import { MoreHorizontal, RotateCcw, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IQuarantineData } from "@/lib/types/data";
import { IQuarantineState } from "@/lib/types/states";
import { useTranslation } from "react-i18next";

interface ActionsCellProps{
     threat: IQuarantineData,
     setState: (overrides: Partial<IQuarantineState>) => void
}
export default function ActionsCell({threat, setState}: ActionsCellProps){
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
                    <DropdownMenuItem onClick={()=>setState({
                         id: threat.id,
                         popupState: "restore"
                    })}>
                         <RotateCcw/>
                         {t("actions.restore")}
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={()=>setState({
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