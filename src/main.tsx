import React from "react";
import ReactDOM from "react-dom/client";
import {router} from "@/routes"
import { RouterProvider } from "react-router/dom";
import "./App.css";
import StartupScanProvider from "./context/startup-scan";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StartupScanProvider>
      <RouterProvider router={router}/>
    </StartupScanProvider>
  </React.StrictMode>,
);