import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ExternalLink, RotateCcw } from "lucide-react";

interface Props{
     isPending: boolean,
     handleCheck: () => void
}
export default function NoClamAVPage({isPending, handleCheck}: Props){
     return (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 place-content-center">
               <img src="/shrug.webp" alt="Uncertain" width={450} height={450}/>
               <div className="flex flex-col items-center justify-center text-center gap-4">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight font-medium">Oops, No <span className="text-primary">ClamAV</span> Found...</h1>
                    <p>Make sure to Install ClamAV by following the installation guide here:</p>
                    <Button variant="link" asChild>
                         <a href="https://docs.clamav.net/manual/Installing.html" target="_blank"><ExternalLink/> docs.clamav.net/manual/Installing.html</a>
                    </Button>
                    <p>Once you installed ClamAV, click on the <span className="font-semibold">Check Availability</span> button to activate the ClamAV GUI for free</p>
                    <Button onClick={handleCheck} disabled={isPending}>
                         {isPending ? <Spinner/> : <RotateCcw/>}
                         {isPending ? "Checking..." : "Check Availability"}
                    </Button>
               </div>
          </div>
     )
}