import { LineChart } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IActivityStat } from "@/lib/types/stats"
import { ChartProps } from "@/lib/types/props"
import { NoData } from "@/components/charts/no-data"
import { Suspense, lazy  } from "react"
import { useTranslation } from "react-i18next"
const ActivityChart = lazy(()=>import("@/components/charts/activity"))

export function ScanActivity({data}: ChartProps<IActivityStat[]>) {
  const {t} = useTranslation("stats")
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="size-5"/>
          {t("activity.title")}
        </CardTitle>
        <CardDescription>{t("date.last-6-months")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<NoData label={t("loading")}/>}>
          <ActivityChart data={data}/>
        </Suspense>
      </CardContent>
    </Card>
  )
}
