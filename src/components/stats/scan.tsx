import { Search } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IScanTypeStat } from "@/lib/types/stats"
import { ChartProps } from "@/lib/types/props"
import { NoData } from "@/components/charts/no-data"
import { Suspense, lazy } from "react"
import { useTranslation } from "react-i18next"
const ScanChart = lazy(()=>import("@/components/charts/scan"))

export function ScanTypes({data}: ChartProps<IScanTypeStat[]>) {
  const {t} = useTranslation("stats")
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="size-5"/>
          {t("scan.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<NoData label={t("loading")}/>}>
          <ScanChart data={data}/>
        </Suspense>
      </CardContent>
    </Card>
  )
}
