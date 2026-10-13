import { Outlet } from "react-router";
import { Suspense } from "react";
import SplashScreen from "@/components/layout/splash-screen";
import { ThemeProvider } from "@/context/themes";

const LazyLayout = () => (
     <ThemeProvider>
          <Suspense fallback={<SplashScreen/>}>
               <Outlet />
          </Suspense>
     </ThemeProvider>
);

export default LazyLayout;