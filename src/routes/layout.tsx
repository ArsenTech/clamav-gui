import { Outlet } from "react-router";
import { Suspense } from "react";
import SplashScreen from "@/components/layout/splash-screen";

const LazyLayout = () => (
     <Suspense fallback={<SplashScreen/>}>
          <Outlet />
     </Suspense>
);

export default LazyLayout;