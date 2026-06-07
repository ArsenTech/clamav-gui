import ScanContent from "@/contents/scan";
import ScanProvider from "@/context/antivirus/scan";
import { ScanType } from "@/lib/types/enums";
import { useParams, useSearchParams } from "react-router";

export default function ScanPage(){
     const [searchParams] = useSearchParams();
     const path = searchParams.getAll("path");
     const {type} = useParams<{type: ScanType}>();
     return (
          <ScanProvider
               type={type}
               path={path}
          >
               <ScanContent/>
          </ScanProvider>
     ) 
}