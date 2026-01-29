import SettingsItem from "@/components/settings-item";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ArrowDownUp, CheckCircle, CirclePower, Plus, Power, Shield, ShieldOff, Square, Terminal, Trash2, XCircle } from "lucide-react";

const exclusions: {
     directories: string[],
     puaCategories: string[]
} = {
     directories: ["Thing 1", "Thing 2", "Thing 3"],
     puaCategories: ["Category 1", "Category 2", "Category 3"],
}

export default function ProtectionSettings(){
     const isActive = true;
     return (
          <div className="px-1 py-2 space-y-3">
               <SettingsItem
                    Icon={Shield}
                    title="Real Time Protection Settings"
                    className="space-y-4"
               >
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label>Real-Time Protection</Label>
                              <p className="text-muted-foreground text-sm">Scans the new file once it appeared</p>
                         </div>
                         <Switch/>
                    </div>
               </SettingsItem>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <SettingsItem
                         Icon={ShieldOff}
                         title="Exclusions"
                         description="--exclude-dir"
                         className="space-y-2.5"
                    >
                         <Button variant="outline">
                              <Plus/>
                              Add an exclusion
                         </Button>
                         {exclusions.directories.length > 0 ? (
                              <ul className="space-y-2">
                                   {exclusions.directories.map((exclusion,i)=>(
                                        <li key={i+1} className="flex justify-between items-center gap-2 pb-1 border-b last:pb-0 last:border-none break-all">
                                             {exclusion}
                                             <Button variant="ghost" size="icon-lg" title="Remove">
                                                  <Trash2/>
                                             </Button>
                                        </li>
                                   ))}
                              </ul>
                         ) : (
                              <p className="text-muted-foreground font-medium text-center mt-1">No Folder Exclusions yet</p>
                         )}
                    </SettingsItem>
                    <SettingsItem
                         Icon={ShieldOff}
                         title="PUA Exclusions"
                         description="--exclude-pua"
                         className="space-y-2.5"
                    >
                         <Button variant="outline">
                              <Plus/>
                              Add an exclusion
                         </Button>
                         {exclusions.puaCategories.length > 0 ? (
                              <ul className="space-y-2">
                                   {exclusions.puaCategories.map((exclusion,i)=>(
                                        <li key={i+1} className="flex justify-between items-center gap-2 pb-1 border-b last:pb-0 last:border-none break-all">
                                             {exclusion}
                                             <Button variant="ghost" size="icon-lg" title="Remove">
                                                  <Trash2/>
                                             </Button>
                                        </li>
                                   ))}
                              </ul>
                         ) : (
                              <p className="text-muted-foreground font-medium text-center mt-1">No PUA Category Exclusions yet</p>
                         )}
                    </SettingsItem>
               </div>
               <SettingsItem
                    Icon={Shield}
                    title="ClamD (Daemon)"
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
               >
                    <div className="flex flex-col flex-wrap justify-center items-center gap-3">
                         <ButtonGroup className="w-full">
                              <Button className="flex-1"><Power/> Start</Button>
                              <Button variant="secondary" className="flex-1"><Square/> Stop</Button>
                         </ButtonGroup>
                         <Button className="w-full"><Terminal/> Show Supported Commands</Button>
                         <ButtonGroup className="w-full">
                              <Button className="flex-1"><ArrowDownUp/> Ping</Button>
                              <Button className="flex-1" variant="secondary"><CirclePower/> Shutdown</Button>
                         </ButtonGroup>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2">
                         <div className="flex items-center justify-center gap-2 w-full">
                              {isActive ? (
                                   <CheckCircle className="text-emerald-700 dark:text-emerald-400 size-10"/>
                              ) : (
                                   <XCircle className="text-destructive size-10"/>
                              )}
                              <span className={cn("text-3xl font-medium", isActive ? "text-emerald-700 dark:text-emerald-400" : "text-destructive")}>
                                   {isActive ? 'ClamD is Active!' : "ClamD is Inactive!"}
                              </span>
                         </div>
                         <p className="text-sm text-muted-foreground">
                              {isActive ? "The Direct Scan feature is Active" : "Please start the ClamD to activate the real time protection"}
                         </p>
                    </div>
               </SettingsItem>
          </div>
     )
}