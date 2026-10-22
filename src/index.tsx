import React from "react";
import ReactDOM from "react-dom/client";
import {router} from "@/routes"
import { RouterProvider } from "react-router/dom";
import "./App.css";
import StartupScanProvider from "./context/antivirus/startup-scan";
import "@/i18n"
import { RealtimeProvider } from "./context/antivirus/real-time";
import { SettingsProvider } from "./context/settings";
import { QuarantineCountProvider } from "./context/antivirus/quarantine-count";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
     <React.StrictMode>
          <SettingsProvider>
               <QuarantineCountProvider>
                    <RealtimeProvider>
                         <StartupScanProvider>
                              <RouterProvider router={router}/>
                         </StartupScanProvider>
                    </RealtimeProvider>
               </QuarantineCountProvider>
          </SettingsProvider>
     </React.StrictMode>
);