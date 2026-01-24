import { AppLayout } from "@/components/layout";
import LogText from "@/components/log";
import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Link, useParams, useSearchParams } from "react-router";

interface Props{
     returnUrl: string
}
export default function LogPage({returnUrl}: Props){
     const {logId} = useParams<{ logId: string }>();
     const [logs, setLogs] = useState<string[]>([]);
     const [isLoading, startTransition] = useTransition();
     const [searchParams] = useSearchParams();
     const category = searchParams.get("category");
     useEffect(()=>{
          startTransition(async()=>{
               if(!logId || !category){
                    setLogs([`[ERROR] Failed to load the log (Log ID: ${logId})`])
                    return;
               }
               try{
                    const logs = await invoke<string>("read_log",{
                         id: logId,
                         category
                    })
                    setLogs(logs.split("\n").filter(Boolean))
               } catch (err) {
                    setLogs([`[ERROR] Failed to load the log (Log ID: ${logId})`])
                    console.error(err)
               }
          })
     },[])
     return (
          <AppLayout className="space-y-4 p-4">
               <div className="space-y-4">
                    <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Log Viewer</h1>
                    <Button asChild size="sm" variant="outline">
                         <Link to={returnUrl}>
                              <ChevronLeft/> Back
                         </Link>
                    </Button>
                    <LogText
                         logs={logs}
                         isLoading={isLoading}
                    />
               </div>
          </AppLayout>
     )
}