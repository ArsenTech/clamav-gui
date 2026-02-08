import { LucideProps } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { cn } from "@/lib/utils";

interface Props{
     Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
     title: string,
     children: React.ReactNode,
     className?: string,
     description?: string,
     button?: React.JSX.Element,
     type?: "default" | "danger"
}
export default function SettingsItem({children, Icon, title, className, description, button, type="default"}: Props){
     const borderColor = cn(type==="default" ? "border-border" : "border-destructive")
     return (
          <Card className={borderColor}>
               <CardHeader>
                    <div className="flex items-between justify-center gap-2 w-full">
                         <div className="space-y-2 w-full">
                              <CardTitle className="flex items-center gap-2"><Icon className="size-5"/> {title}</CardTitle>
                              {!!description && (
                                   <CardDescription>{description}</CardDescription>
                              )}
                         </div>
                         {button}
                    </div>
               </CardHeader>
               <CardContent className={className}>
                    {children}
               </CardContent>
          </Card>
     )
}