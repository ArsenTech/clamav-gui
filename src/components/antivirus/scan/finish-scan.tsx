import { ThreatsTable } from "@/components/data-table/tables/threats";
import { Button } from "@/components/ui/button";
import { BugOff, EyeOff, ShieldAlert, ShieldBan, ShieldCheck, Trash } from "lucide-react";
import { Link } from "react-router";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { THREATS_COLS } from "@/lib/constants/columns";
import { QUARANTINE_DATA } from "@/lib/constants";

interface Props{
     threatCount: number
}
export default function ScanFinishResult({threatCount}: Props){
     return threatCount<=0 ? (
          <>
               <ShieldCheck className="size-32 text-emerald-700"/>
               <h2 className="text-lg md:text-2xl font-medium">No items detected!</h2>
               <Button asChild>
                    <Link to="/">Back to the overview</Link>
               </Button>
          </>
     ) : (
          <>
               <ShieldAlert className="size-32 text-red-700"/>
               <h2 className="text-lg md:text-2xl font-medium">{threatCount} {threatCount<=1 ? "threat" : "threats"} require attention</h2>
               <ThreatsTable
                    columns={THREATS_COLS}
                    data={QUARANTINE_DATA}
               />
               <ButtonGroup>
                    <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                              <Button><ShieldCheck/> Resolve</Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                              <DropdownMenuItem><BugOff/> Quarantine All</DropdownMenuItem>
                              <DropdownMenuItem><EyeOff/> Ignore All</DropdownMenuItem>
                              <DropdownMenuItem><ShieldBan/> Block All</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive"><Trash className="text-destructive"/> Delete All</DropdownMenuItem>
                         </DropdownMenuContent>
                    </DropdownMenu>
                    <Button asChild variant="secondary">
                         <Link to="/">Back to the overview</Link>
                    </Button>
               </ButtonGroup>
          </>
     )
}