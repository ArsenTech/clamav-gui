import { LucideProps } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import React from "react";

interface Props{
     Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
     title: string,
     children: React.ReactNode,
     className?: string,
     description?: string
}
export default function SettingsItem({children, Icon, title, className, description}: Props){
     return (
          <Card>
               <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Icon className="size-5"/> {title}</CardTitle>
                    {!!description && (
                         <CardDescription>{description}</CardDescription>
                    )}
               </CardHeader>
               <CardContent className={className}>
                    {children}
               </CardContent>
          </Card>
     )
}