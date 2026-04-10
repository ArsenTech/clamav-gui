import { relaunch } from "@tauri-apps/plugin-process";
import { check } from "@tauri-apps/plugin-updater"
import { INITIAL_UPDATER_STATE } from "@/lib/constants/states";
import { IUpdaterState } from "@/lib/types/states";
import { useEffect, useMemo, useState, useTransition } from "react";
import { GuiUpdaterStatus } from "@/lib/types/enums";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { openUrl } from "@tauri-apps/plugin-opener";
import { getErrorMessage } from "@/lib/helpers";

export function useGuiUpdater(){
     const [isChecking, startChecking] = useTransition();
     const [isUpdating, startUpdating] = useTransition();
     const {t} = useTranslation("update")
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
                         })
                    } else {
                         setUpdaterState({
                              status: GuiUpdaterStatus.Updated,
                         })
                    }
               } catch (err){
                    toast.error(t("gui.failed-check.main"),{
                         description: getErrorMessage(err)
                    })
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
                         ["clamav","settings-tab","clamav-version","versions"].map(val=>localStorage.removeItem(val))
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
                    toast.error(t("gui.failed-update.main"),{
                         description: getErrorMessage(err)
                    })
                    setUpdaterState({
                         status: GuiUpdaterStatus.UpdateError,
                         total: 0,
                         downloaded: 0
                    })
               }
          })
     }
     const relaunchApp = async() => await relaunch();
     const openReleaseNotes = async() => await openUrl("https://github.com/ArsenTech/clamav-gui/blob/main/CHANGELOG.md")
     useEffect(()=>{
          checkForUpdates()
     },[]);
     const currProgress = useMemo(()=>(guiUpdate.downloaded/guiUpdate.total)*100,[guiUpdate.downloaded,guiUpdate.total]);
     const {status} = guiUpdate
     return {
          status,
          currProgress,
          relaunchApp,
          updateGUI,
          isChecking,
          isUpdating,
          openReleaseNotes,
          checkForUpdates
     }
}