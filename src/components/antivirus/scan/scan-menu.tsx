import { Button } from "@/components/ui/button";
import { FileSearch, FolderSearch, MailSearch, Search, SearchCheck } from "lucide-react";

export default function ScanMenu(){
     return (
          <>
          <div className="flex justify-center items-center gap-2 flex-col">
               <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full flex justify-between items-center">
                    <Search className="flex-1 size-12 text-primary"/>
                    <div className="flex-3">
                         <h2 className="text-lg md:text-xl font-medium lg:text-2xl">Main Scan</h2>
                         <p>Check common locations now</p>
                    </div>
               </div>
               <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full flex justify-between items-center">
                    <SearchCheck className="flex-1 size-12 text-primary"/>
                    <div className="flex-3">
                         <h2 className="text-lg md:text-xl font-medium lg:text-2xl">Full Scan</h2>
                         <p>Scan everything (might take a while)</p>
                    </div>
               </div>
               <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full flex justify-between items-center">
                    <FolderSearch className="flex-1 size-12 text-primary"/>
                    <div className="flex-3">
                         <h2 className="text-lg md:text-xl font-medium lg:text-2xl">Custom Scan</h2>
                         <p>Choose a folder to scan</p>
                    </div>
               </div>
               <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full flex justify-between items-center">
                    <FileSearch className="flex-1 size-12 text-primary"/>
                    <div className="flex-3">
                         <h2 className="text-lg md:text-xl font-medium lg:text-2xl">File Scan</h2>
                         <p>Choose a file to scan</p>
                    </div>
               </div>
               <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full flex justify-between items-center">
                    <MailSearch className="flex-1 size-12 text-primary"/>
                    <div className="flex-3">
                         <h2 className="text-lg md:text-xl font-medium lg:text-2xl">Mail Scan</h2>
                         <p>Scan through emails</p>
                    </div>
               </div>
               <Button>Start Scanning</Button>
          </div>
          </>
     )
}