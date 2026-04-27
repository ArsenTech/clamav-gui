import { GuiUpdaterStatus, ScanType } from "../types/enums";
import { IDeviceInfo, IFinishScanState, IHistoryPageState, IQuarantineState, IScanPageState, ISchedulerState, IDefsUpdaterState, IUpdaterState, IVersion } from "../types/states";

export const INITIAL_DEIVCE_INFO: IDeviceInfo = {
     sys_os: "",
     sys_host: "",
     sys_name: "",
}
export const INITIAL_VERSION_INFO: IVersion = {
     app: "0.0.0",
     tauri: "0.0.0",
}
export const GET_INITIAL_SCAN_STATE = (type: ScanType, path: string[] | null): IScanPageState => ({
     scanType: type,
     logs: [],
     currLocation: "",
     duration: 0,
     scannedFiles: 0,
     totalFiles: 0,
     paths: path ?? [],
     exitCode: 0,
     errMsg: undefined,
     threats: [],
     status: type===ScanType.None ? "idle" : "starting",
     isReconnected: false
})
export const INITIAL_DEF_UPDATE_STATE: IDefsUpdaterState = {
     exitMsg: null,
     isRequired: false,
     lastUpdated: null,
     isUpdatingDefs: false,
}
export const INITIAL_FINISH_SCAN_STATE: IFinishScanState = {
     currThreat: null,
     popupState: ""
}
export const INITIAL_HISTORY_STATE: IHistoryPageState = {
     popupState: "",
     showDetails: false,
     details: null,
     data: []
}
export const INITIAL_QUARANTINE_STATE: IQuarantineState = {
     popupState: "",
     id: "",
     data: []
}
export const INITIAL_SCHEDULER_STATE: ISchedulerState = {
     popupState: "",
     job_id: "",
     data: []
}
export const INITIAL_UPDATER_STATE: IUpdaterState = {
     status: GuiUpdaterStatus.Checking,
     newVersion: null,
     patchDate: null,
     downloaded: 0,
     total: 0
}