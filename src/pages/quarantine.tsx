import QuarantineContent from "@/contents/quarantine";
import QuarantineProvider from "@/context/antivirus/quarantine";

export default function QuarantinePage(){
     return (
          <QuarantineProvider>
               <QuarantineContent/>
          </QuarantineProvider>
     )
}