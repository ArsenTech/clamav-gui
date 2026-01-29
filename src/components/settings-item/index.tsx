import { LucideProps } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface Props{
     Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
     title: string,
     children: React.ReactNode,
     className?: string,
     description?: string,
     button?: React.JSX.Element
}
export default function SettingsItem({children, Icon, title, className, description, button}: Props){
     return (
          <Card>
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