import React from "react";
import ReactDOM from "react-dom/client";
import {router} from "./routes"
import { RouterProvider } from "react-router/dom";
import "./App.css";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import MainSidebar from "./components/main-sidebar";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SidebarProvider>
      <MainSidebar/>
      <main className="px-4 py-2">
        <SidebarTrigger />
        <RouterProvider router={router}/>
      </main>
    </SidebarProvider>
  </React.StrictMode>,
);