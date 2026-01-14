import { AppLayout } from "@/components/layout";
import SafetyIndicator from "@/components/antivirus/indicator";

export default function App() {
  return (
    <AppLayout className="flex justify-center items-center gap-3 flex-col">
      <SafetyIndicator type="safe"/>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 w-full p-4 gap-4">
        <div className="w-full p-4 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36">

        </div>
        <div className="w-full p-4 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36">

        </div>
        <div className="w-full p-4 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36">

        </div>
        <div className="w-full p-4 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36">

        </div>
        <div className="w-full p-4 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36">

        </div>
        <div className="w-full p-4 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36">

        </div>
        <div className="w-full p-4 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36">

        </div>
        <div className="w-full p-4 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36">

        </div>
      </div>
    </AppLayout>
  )
}