import { createBrowserRouter, Outlet } from "react-router";
import App from "@/pages/main-page";
import AboutPage from "@/pages/about";
import QuarantinePage from "@/pages/quarantine";
import ScanPage from "@/pages/scan";
import StatsPage from "@/pages/stats";
import HistoryPage from "./pages/history";
import SchedulerPage from "./pages/scheduler";
import SettingsPage from "./pages/settings";
import UpdateDefinitions from "./pages/update";
import LogPage from "./pages/log-page";
const RouteLayout = () => <Outlet/>

export const router = createBrowserRouter([
     {
          path: "/",
          element: <App/>
     },
     {
          path: "/quarantine",
          element: <QuarantinePage/>
     },
     {
          path: "/scan",
          element: <ScanPage/>
     },
     {
          path: "/stats",
          element: <StatsPage/>
     },
     {
          path: "/history",
          element: <RouteLayout/>,
          children: [
               {
                    index: true,
                    element: <HistoryPage/>,
               },
               {
                    path: ":logId",
                    element: <LogPage/>
               }
          ]
     },
     {
          path: "/scheduler",
          element: <SchedulerPage/>
     },
     {
          path: "/about",
          element: <AboutPage/>
     },
     {
          path: "/settings",
          element: <SettingsPage/>
     },
     {
          path: "/update",
          element: <UpdateDefinitions/>
     }
])