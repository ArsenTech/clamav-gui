import { Label } from "../ui/label"

interface Props{
     title: string,
     description: string,
     children: React.ReactNode
}
export default function SettingsOption({title, description, children}: Props){
     return (
          <div className="flex flex-row items-center justify-between">
               <div className="space-y-1">
                    <Label>{title}</Label>
                    <p className="text-muted-foreground text-sm">{description}</p>
               </div>
               {children}
          </div>
     )
}