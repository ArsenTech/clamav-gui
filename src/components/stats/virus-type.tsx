import { Bug } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IVirusTypeStat } from "@/lib/types/stats"
import { ChartProps } from "@/lib/types/props"
import { NoData } from "@/components/charts/no-data"
import { Suspense, lazy } from "react"
const VirusTypesChart = lazy(()=>import("@/components/charts/virus-type"))

export function VirusTypes({data,t}: ChartProps<IVirusTypeStat[]>) {
  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex items-center gap-2">
          <Bug className="size-5"/>
          {t("virus-types.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <Suspense fallback={<NoData label={t("loading")}/>}>
          <VirusTypesChart data={data} t={t}/>
        </Suspense>
      </CardContent>
    </Card>
  )
}
