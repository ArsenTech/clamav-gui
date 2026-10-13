import { ScanType } from "@/lib/types/enums";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { IScanMenuItem } from "@/lib/types/items";

interface ScanMenuCardProps{
     data: IScanMenuItem,
     currScanType: ScanType,
     onScanTypeChange: (scanType: ScanType) => void
}
export default function ScanMenuCard({data, currScanType, onScanTypeChange}: ScanMenuCardProps){
     const {t} = useTranslation("scan");
     return data.type!==ScanType.None ? (
          <div className={cn("p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full flex justify-between items-center hover:border-primary hover:cursor-pointer",currScanType!==data.type ? "border-border bg-card" : "border-primary bg-primary/5")} onClick={()=>onScanTypeChange(data.type)}>
               <data.Icon className="flex-1 size-12 text-primary"/>
               <div className="flex-3">
                    <h2 className="text-lg md:text-xl font-medium lg:text-2xl">{t(`scan-type.${data.type}.name`)}</h2>
                    <p>{t(`scan-type.${data.type}.desc`)}</p>
               </div>
          </div>
     ) : null
}