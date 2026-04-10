import { Bug } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IThreatStatusStat } from "@/lib/types/stats"
import { ChartProps } from "@/lib/types/props"
import { NoData } from "@/components/charts/no-data"
import { Suspense, lazy } from "react"
import { useTranslation } from "react-i18next"
const ThreatsChart = lazy(()=>import("@/components/charts/threats"))

export function ThreatsStats({data}: ChartProps<IThreatStatusStat[]>) {
  const {t} = useTranslation("stats")
  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex items-center gap-2">
          <Bug className="size-5"/>
          {t("threats.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <Suspense fallback={<NoData label={t("loading")}/>}>
          <ThreatsChart data={data}/>
        </Suspense>
      </CardContent>
    </Card>
  )
}
