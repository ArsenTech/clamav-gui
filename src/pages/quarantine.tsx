import AntivirusProvider from "@/context/antivirus";
import QuarantineContent from "@/contents/quarantine";

export default function QuarantinePage(){
     return (
          <AntivirusProvider>
               <QuarantineContent/>
          </AntivirusProvider>
     )
}