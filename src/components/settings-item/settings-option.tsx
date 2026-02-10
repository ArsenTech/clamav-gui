import { CircleQuestionMark } from "lucide-react"
import { Label } from "../ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface Props{
     title: string,
     description: string,
     children: React.ReactNode,
     tooltip?: string
}
export default function SettingsOption({title, description, children, tooltip}: Props){
     return (
          <div className="flex flex-row items-center justify-between">
               <div className="space-y-1">
                    <Label className="flex items-center gap-2">
                         {title}
                         {tooltip && (
                              <Tooltip>
                                   <TooltipTrigger>
                                        <CircleQuestionMark className="size-4 text-muted-foreground"/>
                                   </TooltipTrigger>
                                   <TooltipContent>
                                        {tooltip}
                                   </TooltipContent>
                              </Tooltip>
                         )}
                    </Label>
                    <p className="text-muted-foreground text-sm">{description}</p>
               </div>
               {children}
          </div>
     )
}