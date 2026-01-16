import { ThreatsTable } from "@/components/data-table/tables/threats";
import { AppLayout } from "@/components/layout";
import { ShieldCheck } from "lucide-react"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { IQuarantineData } from "@/lib/types";
import { QUARANTINE_COLS } from "@/lib/constants/columns";

export const quarantineData: IQuarantineData[] = [
     {
          id: "1",
          displayName: "Some.Trojan.Malware",
          filePath: "C:\\Users\\User\\Downloads\\a-shady-contract.pdf.exe",
          status: "detected",
          detectedAt: "2020-05-05"
     },
     {
          id: "1",
          displayName: "Ransom.Malware",
          filePath: "C:\\Users\\User\\Downloads\\a-shady-contract.pdf.exe",
          status: "quarantined",
          detectedAt: "2020-05-05"
     },
     {
          id: "1",
          displayName: "RAT.Malware",
          filePath: "C:\\Users\\User\\Downloads\\a-shady-contract.pdf.exe",
          status: "blocked",
          detectedAt: "2020-05-05"
     }
]

export default function QuarantinePage(){
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">Quarantine</h1>
               {(quarantineData && quarantineData.length>0) ? (
                    <ThreatsTable
                         columns={QUARANTINE_COLS}
                         data={quarantineData}
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