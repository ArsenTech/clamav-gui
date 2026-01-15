import { createBrowserRouter } from "react-router";
import App from "@/pages/main-page";
import AboutPage from "@/pages/about";
import QuarantinePage from "@/pages/quarantine";
import ScanPage from "@/pages/scan";
import StatsPage from "@/pages/stats";

export const router = createBrowserRouter([
     {
          path: "/",
          element: <App/>
     },
     {
          path: "/about",
          element: <AboutPage/>
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
     }
])