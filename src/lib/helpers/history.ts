import { TFunction } from "i18next";
import { HistoryDetails } from "../types";
import { HistoryClearType, ScanResult } from "../types/enums";

export function translateDetails(d: HistoryDetails, t: TFunction<"history">) {
     if (!d.details || d.details===null) return t(`details.${d.type}`);
     switch (d.type) {
          case "real-time-error":
               return t("details.real-time-error", { err: d.details.err });
          case "real-time-start":
               return t("details.real-time-start", {
                    behavior: t(`behavior.${d.details.behavior}`),
                    count: d.details.paths,
               });
          case "quarantine-threat":
          case "restore-threat":
          case "delete-threat":
               return t(`details.${d.type}`, { threat: d.details.threat });
          case "scan-start":
               return t("details.scan-start", { scanType: d.details.scan_type });
          case "scan-finish": {
               const { result, exit_code, found_threats } = d.details;
               if (result === ScanResult.Partial) return t("details.scan-finish.partial");
               if (result === ScanResult.ClamavError) return t("details.scan-finish.clamav-error");
               if (result === ScanResult.Failed) return t("details.scan-finish.error", { code: exit_code });
               return t("details.scan-finish.state", { count: found_threats });
          }
          case "def-update-finish": {
               const exits = [
                    t("details.def-update-finish.success"),
                    t("details.def-update-finish.warning"),
               ];
               return exits[d.details.exit_code] ?? t("details.def-update-finish.error");
          }
          case "def-update-error":
               return d.details.err;
          case "scheduler-create":
          case "scheduler-delete":
          case "scheduler-trigger-error":
          case "scheduler-trigger":
               return t(`details.${d.type}`, { task: d.details.task_name });
          case "file-delete":
               return t("details.file-delete", { path: d.details.file_path });
          case "file-delete-error":
               return t("details.file-delete-error", { path: d.details.file_path, err: d.details.err });
          case "gui-updater-check-error":
               return t("details.gui-updater-check-error", {err: d.details.err})
          case "gui-updater-error":
               return t("details.gui-updater-error", {err: d.details.err})
          case "gui-updater-updated":
               return t("details.gui-updater-updated", {version: d.details.version})
     }
}

export const getTimeBasedCutoff = (mode: HistoryClearType): number | null => {
    const day = 24 * 60 * 60 * 1000;
    if (mode === HistoryClearType.Last24Hours) return Date.now() - day;
    if (mode === HistoryClearType.Last7Days)  return Date.now() - 7 * day;
    if (mode === HistoryClearType.Last30Days) return Date.now() - 30 * day;
    return null;
};