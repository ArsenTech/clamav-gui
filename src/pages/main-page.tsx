import { AppLayout } from "@/components/layout";
import SafetyIndicator from "@/components/antivirus/indicator";
import { BugOff, FolderSearch, MailSearch, RotateCcw, History, ScrollText, Search, SearchCheck, ShieldCheck, ClipboardClock } from "lucide-react";

export default function App() {
  return (
    <AppLayout className="flex justify-center items-center gap-3 flex-col">
      <SafetyIndicator type="safe"/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full p-4 gap-4">
        <div className="w-full px-2 py-4 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36 flex justify-center items-center gap-4">
          <Search className="size-12 text-primary"/>
          <div className="w-[calc(100%-48px)]">
            <h2 className="text-lg md:text-xl font-medium">Main Scan</h2>
            <p>Check common locations now</p>
          </div>
        </div>
        <div className="w-full px-2 py-4 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36 flex justify-center items-center gap-4">
          <SearchCheck className="size-12 text-primary"/>
          <div className="w-[calc(100%-48px)]">
            <h2 className="text-lg md:text-xl font-medium">Full Scan</h2>
            <p>Scan everything (might take a while)</p>
          </div>
        </div>
        <div className="w-full px-2 py-4 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36 flex justify-center items-center gap-4">
          <FolderSearch className="size-12 text-primary"/>
          <div className="w-[calc(100%-48px)]">
            <h2 className="text-lg md:text-xl font-medium">Custom Scan</h2>
            <p>Choose a folder to scan</p>
          </div>
        </div>
        <div className="w-full px-2 py-4 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36 flex justify-center items-center gap-4">
          <MailSearch className="size-12 text-primary"/>
          <div className="w-[calc(100%-48px)]">
            <h2 className="text-lg md:text-xl font-medium">Mail Scan</h2>
            <p>Scan through emails</p>
          </div>
        </div>
        <div className="w-full px-2 py-4 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36 flex justify-center items-center gap-4">
          <BugOff className="size-12 text-primary"/>
          <div className="w-[calc(100%-48px)]">
            <h2 className="text-lg md:text-xl font-medium">Quarantine</h2>
            <p>View isolated malicious files</p>
          </div>
        </div>
        <div className="w-full px-2 py-4 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36 flex justify-center items-center gap-4">
          <RotateCcw className="size-12 text-primary"/>
          <div className="w-[calc(100%-48px)]">
            <h2 className="text-lg md:text-xl font-medium">Update</h2>
            <p>Update Virus Definitions from the ClamAV database</p>
          </div>
        </div>
        <div className="w-full px-2 py-4 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36 flex justify-center items-center gap-4">
          <History className="size-12 text-primary"/>
          <div className="w-[calc(100%-48px)]">
            <h2 className="text-lg md:text-xl font-medium">History</h2>
            <p>View the ClamAV GUI Actions history</p>
          </div>
        </div>
        <div className="w-full px-2 py-4 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36 flex justify-center items-center gap-4">
          <ShieldCheck className="size-12 text-primary"/>
          <div className="w-[calc(100%-48px)]">
            <h2 className="text-lg md:text-xl font-medium">Real-time Protection</h2>
            <p>Scans threats in real time</p>
          </div>
        </div>
        <div className="w-full px-2 py-4 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36 flex justify-center items-center gap-4">
          <ClipboardClock className="size-12 text-primary"/>
          <div className="w-[calc(100%-48px)]">
            <h2 className="text-lg md:text-xl font-medium">Scheduler</h2>
            <p>Schedule a scan</p>
          </div>
        </div>
        <div className="w-full px-2 py-4 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36 flex justify-center items-center gap-4">
          <ScrollText className="size-12 text-primary"/>
          <div className="w-[calc(100%-48px)]">
            <h2 className="text-lg md:text-xl font-medium">Logs</h2>
            <p>View the detailed logs from ClamAV</p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}