import { relaunch } from "@tauri-apps/plugin-process";
import {check} from "@tauri-apps/plugin-updater"
import { INITIAL_UPDATER_STATE } from "@/lib/constants/states";
import { IUpdaterState } from "@/lib/types/states";
import { useEffect, useMemo, useState, useTransition } from "react";
import { GuiUpdaterStatus } from "@/lib/types/enums";

export function useGuiUpdater(){
     const [isChecking, startChecking] = useTransition();
     const [isUpdating, startUpdating] = useTransition();
     const [guiUpdate, setGuiUpdate] = useState<IUpdaterState>(INITIAL_UPDATER_STATE)
     const setUpdaterState = (overrides: Partial<IUpdaterState>) => setGuiUpdate(prev=>({...prev, ...overrides}))
     const checkForUpdates = async () => {
          setUpdaterState({
               status: GuiUpdaterStatus.Checking,
               downloaded: 0,
               total: 0
          })
          startChecking(async()=>{
               try {
                    const update = await check();
                    if(update){
                         setUpdaterState({
                              status: GuiUpdaterStatus.NeedsUpdate,
                              notes: !update.body ? null : update.body
                         })
                    } else {
                         setUpdaterState({
                              status: GuiUpdaterStatus.Updated,
                         })
                    }
               } catch (err){
                    console.error(err)
                    setUpdaterState({
                         status: GuiUpdaterStatus.CheckError,
                    })
               }
          })
     }
     const updateGUI = () => {
          setUpdaterState({
               status: GuiUpdaterStatus.Updating,
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
                                             status: GuiUpdaterStatus.Completed
                                        })
                                        break;
                              }
                         });
                    }
               } catch (err){
                    console.error(err)
                    setUpdaterState({
                         status: GuiUpdaterStatus.UpdateError,
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
     const currProgress = useMemo(()=>(guiUpdate.downloaded/guiUpdate.total)*100,[guiUpdate.downloaded,guiUpdate.total]);
     const {status, isOpenNotes, notes} = guiUpdate
     return {
          status,
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