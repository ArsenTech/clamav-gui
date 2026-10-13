import { useNavigate } from "react-router";
import { open } from "@tauri-apps/plugin-dialog";
import { normalizePaths } from "@/lib/helpers";
import { FsOption } from "@/lib/types";
import { useTranslation } from "react-i18next";
import { IQuickAccessItem } from "@/lib/types/items";

interface OverviewCardProps{
     data: IQuickAccessItem
}
export default function OverviewCard({data}: OverviewCardProps){
     const navigate = useNavigate();
     const {t} = useTranslation("overview")
     const openCustomScan = async(href: string, type: FsOption) => {
          const currPath = await open({
               title: t(`dialog-title.${type}`),
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
     return (
          <div className="w-full p-3 shadow-sm rounded-md bg-card text-card-foreground border grow shrink-0 h-36 flex justify-center items-center gap-4 hover:border-primary hover:cursor-pointer" onClick={()=>data.openDialogType==="none" ? navigate(data.href) : openCustomScan(data.href,data.openDialogType)}>
               <data.Icon className="size-10 md:size-12 text-primary"/>
               <div className="w-[calc(100%-48px)] space-y-0.5">
                    <h2 className="text-lg sm:text-xl md:text-base font-medium">{t(`${data.type}.name`)}</h2>
                    <p className="text-sm lg:text-xs">{t(`${data.type}.desc`)}</p>
               </div>
          </div>
     )
}