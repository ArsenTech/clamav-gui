import { useSettings } from "@/context/settings";
import { formatBytes } from "@/lib/helpers/formating";
import { useTranslation } from "react-i18next";

export function SizeCell({value}: {value: number}){
     const {t} = useTranslation()
     return formatBytes(value,t)
}
export function DateCell({value}: {value: string}) {
     const {formatDate} = useSettings();
     return formatDate(value)
}