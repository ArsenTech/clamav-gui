import { Spinner } from "@/components/ui/spinner";
import Logo from "../logo";

export default function SplashScreen(){
     return (
          <div className="flex justify-center items-center gap-3 flex-col h-screen bg-linear-to-bl from-primary via-accent to-background px-4">
               <Logo width={1000} height={265}/>
               <div className="flex items-center gap-2 md:gap-4">
                    <Spinner className="size-6 sm:size-8 md:size-16"/>
                    <p className="text-xl sm:text-3xl md:text-[40px] font-semibold">Loading...</p>
               </div>
          </div>
     )
}