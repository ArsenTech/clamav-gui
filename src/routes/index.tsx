import {lazy} from "react";
import { createBrowserRouter, Outlet } from "react-router";
import LazyLayout from "./layout";
import SchedulerRoute from "./guarded-route";

// Core pages
const App = lazy(() => import("@/pages/main-page"));
const AboutPage = lazy(() => import("@/pages/about"));
const SettingsPage = lazy(() => import("@/pages/settings"));
const SchedulerPage = lazy(() => import("@/pages/scheduler"));

// Scan-related bundle
const ScanMenu = lazy(() => import("@/pages/scan-menu"));
const QuarantinePage = lazy(() => import("@/pages/quarantine"));
const ScanPage = lazy(()=>import("@/pages/scan"));
const StatsPage = lazy(() => import("@/pages/stats"));

// History bundle
const HistoryPage = lazy(() => import("@/pages/history"));
const LogPage = lazy(() => import("@/pages/log-page"));

export const router = createBrowserRouter([
     {
          element: <LazyLayout />,
          children: [
               { path: "/", element: <App />, index: true },
               { path: "/quarantine", element: <QuarantinePage /> },
               {
                    path: "/scan",
                    element: <Outlet/>,
                    children: [
                         {index: true, element: <ScanMenu />},
                         {path: ":type", element: <ScanPage/> }
                    ]
               },
               { path: "/stats", element: <StatsPage /> },
               {
                    path: "/scheduler",
                    element: (
                         <SchedulerRoute>
                              <Outlet/>
                         </SchedulerRoute>
                    ),
                    children: [
                         {index: true, element: <SchedulerPage />},
                         { path: ":logId", element: <LogPage returnUrl="/scheduler"/> }
                    ]
               },
               { path: "/about", element: <AboutPage /> },
               { path: "/settings", element: <SettingsPage /> },
               {
                    path: "/history",
                    element: <Outlet />,
                    children: [
                         { index: true, element: <HistoryPage /> },
                         { path: ":logId", element: <LogPage returnUrl="/history"/> }
                    ]
               }
          ]
     }
]);