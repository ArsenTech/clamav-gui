import React from "react";
import ReactDOM from "react-dom/client";
import {router} from "@/routes"
import { RouterProvider } from "react-router/dom";
import "./App.css";
import StartupScanProvider from "./context/startup-scan";
import { ThemeProvider } from "./context/themes";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
     <React.StrictMode>
          <ThemeProvider>
               <StartupScanProvider>
                    <RouterProvider router={router}/>
               </StartupScanProvider>
          </ThemeProvider>
     </React.StrictMode>,
);