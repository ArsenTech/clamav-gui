import { ThreatsTable } from "@/components/data-table/tables/threats";
import { AppLayout } from "@/components/layout";
import { ShieldCheck } from "lucide-react"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { QUARANTINE_COLS } from "@/lib/constants/columns";
import { QUARANTINE_DATA } from "@/lib/constants";

export default function QuarantinePage(){
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">Quarantine</h1>
               {(QUARANTINE_DATA && QUARANTINE_DATA.length>0) ? (
                    <ThreatsTable
                         columns={QUARANTINE_COLS}
                         data={QUARANTINE_DATA}
                    />
               ) : (
                    <Empty>
                         <EmptyHeader>
                              <EmptyMedia variant="icon">
                                   <ShieldCheck/>
                              </EmptyMedia>
                              <EmptyTitle>No Quarantined Threats</EmptyTitle>
                              <EmptyDescription>Your system is clean and Lookin' Good!</EmptyDescription>
                         </EmptyHeader>
                    </Empty>
               )}
          </AppLayout>
     )
}