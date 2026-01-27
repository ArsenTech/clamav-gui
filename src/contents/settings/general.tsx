import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { useTheme } from "@/context/themes";
import useSettings from "@/hooks/use-settings";
import { DATE_TIME_FORMATS, THEME_SETTINGS } from "@/lib/settings";
import { capitalizeText } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Calendar, Languages, Palette } from "lucide-react";

export default function GeneralSettings(){
     const {setTheme, theme: currTheme, setColor, color: currColor} = useTheme();
     const {setSettings, settings} = useSettings()
     return (
          <div className="px-1 py-2 space-y-3">
               <Card>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2"><Palette className="size-5"/> Appearance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                         <p className="text-muted-foreground font-semibold">Theme</p>
                         <div className="flex justify-center items-center flex-wrap gap-3">
                              {THEME_SETTINGS.theme.map(({theme, name, Icon})=>(
                                   <div key={theme} className={cn("bgxt-card-foreground rounded-md shadow-sm border p-4 flex justify-center items-center gap-2 flex-col h-32 min-w-32 flex-1 text-center hover:border-primary hover:cursor-pointer transition-all",currTheme===theme ? "border-primary bg-primary/10" : "border-border bg-card")} onClick={()=>setTheme(theme)}>
                                        <Icon className="size-16"/>
                                        <h2 className="text-lg font-medium">{name}</h2>
                                   </div>
                              ))}
                         </div>
                         <p className="text-muted-foreground font-semibold">Color</p>
                         <div className="flex justify-center items-center flex-wrap gap-3">
                              {THEME_SETTINGS.color.map(({name, className, hoverClass})=>(
                                   <div key={name} className={cn("bgxt-card-foreground rounded-md shadow-sm border p-4 flex justify-center items-center gap-2 flex-col h-32 min-w-32 flex-1 text-center hover:border-blue-600 hover:cursor-pointer transition-all",currColor===name ? "border-primary bg-primary/10" : "border-border bg-card",hoverClass)} onClick={()=>setColor(name)}>
                                        <Palette className={cn("size-16",className)}/>
                                        <h2 className="text-lg font-medium">{capitalizeText(name)}</h2>
                                   </div>
                              ))}
                         </div>
                    </CardContent>
               </Card>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card>
                         <CardHeader>
                              <CardTitle className="flex items-center gap-2"><Calendar className="size-5"/> Date Format</CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-2">
                              {DATE_TIME_FORMATS.map(({format,name})=>(
                                   <Item
                                        key={`${name}-${format}`}
                                        variant={settings.dateFormat===format ? "muted" : "outline"}
                                        onClick={()=>setSettings({dateFormat: format})}
                                   >
                                        <ItemContent>
                                             <ItemTitle>{name}</ItemTitle>
                                             <ItemDescription>{format}</ItemDescription>
                                        </ItemContent>
                                   </Item>
                              ))}
                         </CardContent>
                    </Card>
                    <Card>
                         <CardHeader>
                              <CardTitle className="flex items-center gap-2"><Languages className="size-5"/> Language</CardTitle>
                         </CardHeader>
                         <CardContent>
                              TODO: Implement i18n support
                         </CardContent>
                    </Card>
               </div>
          </div>
     )
}