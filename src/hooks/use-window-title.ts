import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect } from "react";

function formatAppTitle(page?: string) {
     return page
          ? `${page} | ArsenTech's ClamAV GUI`
          : "ArsenTech's ClamAV GUI";
}

export default function useWindowTitle(title?: string) {
     useEffect(() => {
          const nextTitle = formatAppTitle(title)
          document.title = nextTitle;
          getCurrentWindow().setTitle(nextTitle).catch(console.error);
     }, [title]);
}