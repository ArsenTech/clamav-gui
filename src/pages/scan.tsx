import ScanContent from "@/contents/scan";
import AntivirusProvider from "@/context/antivirus";
import { ScanType } from "@/lib/types/enums";
import { useParams, useSearchParams } from "react-router";

export default function ScanPage(){
     const [searchParams] = useSearchParams();
     const path = searchParams.getAll("path");
     const {type} = useParams<{type: ScanType}>();
     return (
          <AntivirusProvider
               type={type}
               path={path}
          >
               <ScanContent/>
          </AntivirusProvider>
     ) 
}