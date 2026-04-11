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
import { invoke } from "@tauri-apps/api/core";
import { getVersion } from "@tauri-apps/api/app";

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
                         await invoke("append_updater_needed_log")
                         setUpdaterState({
                              status: GuiUpdaterStatus.NeedsUpdate,
                         })
                    } else {
                         await invoke("append_updater_updated_log",{
                              version: await getVersion()
                         })
                         setUpdaterState({
                              status: GuiUpdaterStatus.Updated,
                         })
                    }
               } catch (err){
                    toast.error(t("gui.failed-check.main"),{
                         description: getErrorMessage(err)
                    })
                    await invoke("append_updater_error",{
                         error: getErrorMessage(err),
                         errorType: "check-error"
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
                                        invoke("append_updater_start_log").then(()=>{
                                             contentLength = event.data.contentLength || 0;
                                             setUpdaterState({
                                                  total: contentLength,
                                                  downloaded
                                             })
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
                                        invoke("append_updater_finish_log").then(()=>{
                                             setUpdaterState({
                                                  status: GuiUpdaterStatus.Completed
                                             })
                                        })
                                        break;
                              }
                         });
                    }
               } catch (err){
                    toast.error(t("gui.failed-update.main"),{
                         description: getErrorMessage(err)
                    })
                    await invoke("append_updater_error",{
                         error: getErrorMessage(err),
                         errorType: "update-error"
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