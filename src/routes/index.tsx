import React from "react";
import { createBrowserRouter, Outlet } from "react-router";
import LazyLayout from "./layout";

// Core pages
const App = React.lazy(() => import("@/pages/main-page"));
const AboutPage = React.lazy(() => import("@/pages/about"));
const SettingsPage = React.lazy(() => import("@/pages/settings"));

// Scan-related bundle
const ScanPage = React.lazy(() => import("@/pages/scan"));
const QuarantinePage = React.lazy(() => import("@/pages/quarantine"));
const StatsPage = React.lazy(() => import("@/pages/stats"));

// History bundle
const HistoryPage = React.lazy(() => import("@/pages/history"));
const LogPage = React.lazy(() => import("@/pages/log-page"));

// Tools bundle
const SchedulerPage = React.lazy(() => import("@/pages/scheduler"));
const UpdateDefinitions = React.lazy(() => import("@/pages/update"));

export const router = createBrowserRouter([
     {
          element: <LazyLayout />,
          children: [
               { path: "/", element: <App />, index: true },
               { path: "/quarantine", element: <QuarantinePage /> },
               { path: "/scan", element: <ScanPage /> },
               { path: "/stats", element: <StatsPage /> },
               { path: "/scheduler", element: <SchedulerPage /> },
               { path: "/about", element: <AboutPage /> },
               { path: "/settings", element: <SettingsPage /> },
               { path: "/update", element: <UpdateDefinitions /> },
               {
                    path: "/history",
                    element: <Outlet />,
                    children: [
                         { index: true, element: <HistoryPage /> },
                         { path: ":logId", element: <LogPage /> }
                    ]
               }
          ]
     }
]);