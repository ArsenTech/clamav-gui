import { createBrowserRouter } from "react-router";
import App from "@/pages/main-page";
import AboutPage from "@/pages/about";
import QuarantinePage from "@/pages/quarantine";
import ScanPage from "@/pages/scan";

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
])