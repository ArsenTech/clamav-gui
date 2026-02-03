import { writeTextFile } from "@tauri-apps/plugin-fs";
import { IHistoryData } from "../types";
import {audioDir, desktopDir, documentDir, downloadDir, homeDir, localDataDir, pictureDir, publicDir, tempDir, videoDir} from "@tauri-apps/api/path"

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

export const fetchPaths = async (): Promise<string[]> => {
     const paths = await Promise.all([
          audioDir(),
          desktopDir(),
          documentDir(),
          downloadDir(),
          homeDir(),
          localDataDir(),
          pictureDir(),
          publicDir(),
          tempDir(),
          videoDir(),
     ]);
     return [...new Set(paths.filter(Boolean))];
}