import { useSettings } from "@/context/settings"
import { Navigate } from "react-router";

interface Props{
     children: React.ReactNode
}
export default function SchedulerRoute({children}: Props){
     const {settings} = useSettings();
     if(!settings.enableSchedulerUI){
          return <Navigate to="/"/>
     }
     return children;
}