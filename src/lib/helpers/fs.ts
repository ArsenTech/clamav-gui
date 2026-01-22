import { writeTextFile } from "@tauri-apps/plugin-fs";
import { IHistoryData } from "../types";

// TODO: Export Metadata alongside the actual history data
export const exportJSON = async (path: string, historyData: IHistoryData<"state">[]) => {
     const jsonData = JSON.stringify(historyData,null,2);
     await writeTextFile(path,jsonData);
}

export const escapeCSV = (value: unknown) => {
     if (value == null) return "";
     const str = String(value);
          if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
     }
     return str;
};

export const exportCSV = async (path: string, historyData: IHistoryData<"state">[]) => {
     const headers = ["timestamp", "action", "details", "status"];

     const rows = historyData.map(item =>headers.map(h => escapeCSV(item[h as keyof typeof item])).join(","));

     await writeTextFile(path, [headers.join(","), ...rows].join("\n"));
};