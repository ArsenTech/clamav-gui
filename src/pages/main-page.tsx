import { AppLayout } from "@/components/layout";
import SafetyIndicator from "@/components/antivirus/indicator";
import { useNavigate } from "react-router";
import { QUICK_ACCESS_LINKS } from "@/lib/constants/links";
import { open } from "@tauri-apps/plugin-dialog";
import { useEffect, useState } from "react";
import { normalizePaths, parseClamVersion } from "@/lib/helpers";
import { invoke } from "@tauri-apps/api/core";

export default function App() {
  const navigate = useNavigate();
  const [definitionStatus, setDefinitionStatus] = useState<"updated" | "outdated" | "loading">("loading")
  const openCustomScan = async(href: string, type: "file" | "folder") => {
    const currPath = await open({
      multiple: type==="folder",
      directory: type==="folder",
    });
    if(!currPath) return;
    const paths = normalizePaths(currPath);
    const params = new URLSearchParams();
    for(const path of paths)
      params.append("path",path);
    navigate(`${href}?${params.toString()}`)
  }
  useEffect(()=>{
    (async()=>{
      try{
        const raw = await invoke<string>("get_clamav_version");
        const parsed = parseClamVersion(raw);
        if(!parsed) return;
        setDefinitionStatus(parsed.isOutdated ? "outdated" : "updated")
      } catch {
        setDefinitionStatus("outdated")
      }
    })()
  },[])
  return (
    <AppLayout className="flex justify-center items-center gap-3 flex-col">
      <SafetyIndicator
        definitionStatus={definitionStatus}
        type="safe"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full p-4 gap-4">
        {QUICK_ACCESS_LINKS.map(({name,desc,href,Icon,openDialogType},i)=>(
          <div key={`item-${i+1}`} className="w-full p-3 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36 flex justify-center items-center gap-4 hover:border-primary hover:cursor-pointer" onClick={()=>openDialogType==="none" ? navigate(href) : openCustomScan(href,openDialogType)}>
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