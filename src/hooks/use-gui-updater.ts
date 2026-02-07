import { relaunch } from "@tauri-apps/plugin-process";
import { UPDATER_TEXTS } from "@/lib/constants/maps";
import {check} from "@tauri-apps/plugin-updater"
import { INITIAL_UPDATER_STATE } from "@/lib/constants/states";
import { IUpdaterState } from "@/lib/types/states";
import { useEffect, useMemo, useState, useTransition } from "react";

export function useGuiUpdater(){
     const [isChecking, startChecking] = useTransition();
     const [isUpdating, startUpdating] = useTransition();
     const [guiUpdate, setGuiUpdate] = useState<IUpdaterState>(INITIAL_UPDATER_STATE)
     const setUpdaterState = (overrides: Partial<IUpdaterState>) => setGuiUpdate(prev=>({...prev, ...overrides}))
     const checkForUpdates = async () => {
          setUpdaterState({
               status: "checking",
               downloaded: 0,
               total: 0
          })
          startChecking(async()=>{
               try {
                    const update = await check();
                    if(update){
                         setUpdaterState({
                              status: "needs-update",
                              notes: !update.body ? null : update.body
                         })
                    } else {
                         setUpdaterState({
                              status: "updated",
                         })
                    }
               } catch (err){
                    console.error(err)
                    setUpdaterState({
                         status: "failed-check",
                    })
               }
          })
     }
     const updateGUI = () => {
          setUpdaterState({
               status: "updating",
               downloaded: 0,
               total: 0
          })
          startUpdating(async()=>{
               try {
                    const update = await check();
                    if(update){
                         let downloaded = 0, contentLength = 0;
                         await update.downloadAndInstall((event) => {
                              switch (event.event) {
                                   case 'Started':
                                        contentLength = event.data.contentLength || 0;
                                        setUpdaterState({
                                             total: contentLength,
                                             downloaded
                                        })
                                        break;
                                   case 'Progress':
                                        downloaded += event.data.chunkLength;
                                        setUpdaterState({
                                             total: contentLength,
                                             downloaded
                                        })
                                        break;
                                   case 'Finished':
                                        setUpdaterState({
                                             status: "completed"
                                        })
                                        break;
                              }
                         });
                    }
               } catch (err){
                    console.error(err)
                    setUpdaterState({
                         status: "failed-update",
                         total: 0,
                         downloaded: 0
                    })
               }
          })
     }
     const relaunchApp = async() => await relaunch();
     useEffect(()=>{
          checkForUpdates()
     },[]);
     const updaterText = useMemo(()=>UPDATER_TEXTS[guiUpdate.status],[guiUpdate.status]);
     const currProgress = useMemo(()=>(guiUpdate.downloaded/guiUpdate.total)*100,[guiUpdate.downloaded,guiUpdate.total]);
     const {status, isOpenNotes, notes} = guiUpdate
     return {
          status,
          updaterText,
          currProgress,
          relaunchApp,
          updateGUI,
          isChecking,
          isUpdating,
          setIsOpenNotes: (open: boolean)=>setUpdaterState({isOpenNotes: open}),
          isOpenNotes,
          notes,
          checkForUpdates
     }
}