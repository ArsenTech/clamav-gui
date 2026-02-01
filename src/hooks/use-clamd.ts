import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";

export default function useClamD(){
     const [isActive, setIsActive] = useState<boolean | null>(null);
     const [isBusy, startTransition] = useTransition()

     const checkIsRunning = async() => {
          try{
               return await invoke<boolean>("clamd_ping");
          } catch {
               return false
          }
     }
     const ping = async()=>{
          const status = await checkIsRunning();
          setIsActive(status)
     }
     const start = () => startTransition(async()=>{
          try{
               
               await invoke("clamd_start");
               await ping();
          } catch (err){
               toast.error("Failed to start the ClamD process");
               console.error(err)
          }
     })
     const shutdown = () => startTransition(async()=>{
          try{
               await invoke("clamd_shutdown");
               await ping();
          } catch (err){
               toast.error("Failed to shutdown the ClamD process");
               console.error(err)
          }
     })

     useEffect(() => {
          ping();
          const i = setInterval(ping, 5000);
          return () => clearInterval(i);
     }, []);

     return {
          isActive,
          isBusy,
          ping,
          start,
          shutdown,
     };
}