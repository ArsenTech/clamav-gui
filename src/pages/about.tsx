import { AppLayout } from "@/components/layout";
import useWindowTitle from "@/hooks/use-window-title";
import { AboutContentLoader, CreditsSectionLoader } from "@/loaders/about";
import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";

const AboutContent = lazy(()=>import("@/contents/about"));
const CreditsSection = lazy(()=>import("@/contents/about/credits"));

export default function AboutPage(){
     const {t} = useTranslation("about")
     useWindowTitle(t("title"))
     return (
          <AppLayout className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 p-4">
               <Suspense fallback={(
                    <>
                    <AboutContentLoader/>
                    <CreditsSectionLoader/>
                    </>
               )}>
                    <AboutContent/>
                    <CreditsSection/>
               </Suspense>
          </AppLayout>
     )
}