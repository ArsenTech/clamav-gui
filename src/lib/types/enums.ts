export enum QuickAccessLink{
     MainScan = "main-scan",
     FullScan = "full-scan",
     CustomScan = "custom-scan",
     FileScan = "file-scan",
     Quarantine = "quarantine",
     Update = "update",
     History = "history",
     RealTime = "real-time"
}
export enum SidebarLink{
     Overview = "overview",
     Scan = "scan",
     Quarantine = "quarantine",
     History = "history",
     Stats = "stats",
     Scheduler = "scheduler",
     Settings = "settings",
     About = "about"
}
export enum Indicator{
     Safe = "safe",
     Warning = "warning",
     Alert = "alert",
}
export enum DefinitionStatus{
     Updated = "updated",
     Outdated = "outdated",
     Loading = "loading"
}
export enum LogCategory{
     Scan = "scan",
     Update = "update",
     Quarantine = "quarantine",
     RealTime = "realtime",
     Scheduler = "scheduler"
}
export enum SettingsTab {
     General = "general",
     Advanced = "advanced",
     Scan = "scan",
     Update = "update"
}
export enum DateFormatType{
     American = "us",
     European = "eu",
     International = "iso"
}
export enum ClamAVState{
     Checking = "checking",
     Available = "available",
     Missing = "missing"
}
export enum GuiUpdaterStatus{
     Checking = "checking",
     Updating = "updating",
     NeedsUpdate = "needs-update",
     Updated = "updated",
     CheckError = "failed-check",
     Completed = "completed",
     UpdateError = "failed-update"
}
export enum ScanType{
     None = "",
     Main = "main",
     Full = "full",
     Custom = "custom",
     File = "file"
}
export enum ScanProfiles{
     Main = "main",
     Custom = "custom",
     File = "file"
}
export enum BehaviorMode{
     Balanced = "balanced",
     Safe = "safe",
     Strict = "strict",
     Expert = "expert"
}
export enum ScanOptionGroup {
     Detection = "detection",
     FileTypes = "file-types",
     FileSystem = "filesystem",
     LimitsPerformance = "limits-performance",
     Output = "output",
     Advanced = "advanced"
}
export enum HistoryClearType{
     All = "all",
     Acknowledged = "acknowledged",
     Error = "error"
}