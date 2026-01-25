import { Bug } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartProps, IThreatStatusStat } from "@/lib/types"
import { NoData } from "@/components/charts/no-data"
import { Suspense } from "react"
import React from "react"
const ThreatsChart = React.lazy(()=>import("@/components/charts/threats"))

export function ThreatsStats({data}: ChartProps<IThreatStatusStat[]>) {
  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex items-center gap-2"><Bug className="size-5"/> Threat Status Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <Suspense fallback={<NoData label="Loading..."/>}>
          <ThreatsChart data={data}/>
        </Suspense>
      </CardContent>
    </Card>
  )
}
