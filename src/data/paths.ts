import {audioDir, desktopDir, documentDir, downloadDir, homeDir, localDataDir, pictureDir, publicDir, tempDir, videoDir} from "@tauri-apps/api/path"
import { cache } from "react";

export const fetchPaths = cache(async (): Promise<string[]> => {
     try{
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
     } catch {
          return []
     }
})