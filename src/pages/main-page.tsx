import { AppLayout } from "@/components/layout";
import SafetyIndicator from "@/components/antivirus/indicator";
import { useNavigate } from "react-router";
import { QUICK_ACCESS_LINKS } from "@/lib/constants/links";

export default function App() {
  const navigate = useNavigate()
  return (
    <AppLayout className="flex justify-center items-center gap-3 flex-col">
      <SafetyIndicator type="safe"/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full p-4 gap-4">
        {QUICK_ACCESS_LINKS.map(({name,desc,href,Icon},i)=>(
          <div key={`item-${i+1}`} className="w-full p-3 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36 flex justify-center items-center gap-4 hover:border-primary hover:cursor-pointer" onClick={()=>navigate(href)}>
            <Icon className="size-12 text-primary"/>
            <div className="w-[calc(100%-48px)] space-y-0.5">
              <h2 className="text-lg md:text-xl font-medium">{name}</h2>
              <p className="text-sm">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}