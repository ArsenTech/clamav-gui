import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CUSTOM_SCAN_OPTIONS } from "@/lib/constants/settings";

export default function ScanSettings(){
     return (
          <div className="px-1 py-2 space-y-3">
               <Card>
                    <CardHeader>
                         <CardTitle>Scan Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-4">
                              <div className="flex flex-row items-center justify-between">
                                   <div className="space-y-1">
                                        <Label>Confirm Stop</Label>
                                        <p className="text-muted-foreground text-sm">Show a Confirm Message when you stop the scan.</p>
                                   </div>
                                   <Switch />
                              </div>
                              <div className="flex flex-row items-center justify-between">
                                   <div className="space-y-1">
                                        <Label>Auto startup scan</Label>
                                        <p className="text-muted-foreground text-sm">Scans files with a full scan on startup</p>
                                   </div>
                                   <Switch />
                              </div>
                         </div>
                    </CardContent>
               </Card>
               <Card>
                    <CardHeader>
                         <CardTitle>Custom Scan Options</CardTitle>
                         <CardDescription>Options for the Custom Scan that uses the ClamAV Engine</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-4">
                              {Object.entries(CUSTOM_SCAN_OPTIONS).filter(([__dirname,option])=>option.level==="basic").map(([key,option])=>(
                                   <div key={key} className="flex flex-row items-center justify-between">
                                        <div className="space-y-1">
                                             <Label>{option.label}</Label>
                                             <p className="text-muted-foreground text-sm">{option.flag}</p>
                                        </div>
                                        <Switch />
                                   </div>
                              ))}
                         </div>
                    </CardContent>
               </Card>
          </div>
     )
}