import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CUSTOM_SCAN_OPTIONS } from "@/lib/constants/settings";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label"

export default function AdvancedSettings(){
     return (
          <>
          <div className="px-1 py-2 space-y-3">
               <Card>
                    <CardHeader>
                         <CardTitle>Custom Scan Options</CardTitle>
                         <CardDescription>Advanced options for the Custom Scan. It may reduce detection accuracy</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-4">
                              {Object.entries(CUSTOM_SCAN_OPTIONS).filter(([__dirname,option])=>option.level==="advanced").map(([key,option])=>(
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
          </>
     )
}