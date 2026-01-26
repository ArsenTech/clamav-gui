import { LineChart } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartProps, IActivityStat } from "@/lib/types"
import { NoData } from "@/components/charts/no-data"
import { Suspense, lazy  } from "react"
const ActivityChart = lazy(()=>import("@/components/charts/activity"))

export function ScanActivity({data}: ChartProps<IActivityStat[]>) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><LineChart className="size-5"/> Scan Activity</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<NoData label="Loading..."/>}>
          <ActivityChart data={data}/>
        </Suspense>
      </CardContent>
    </Card>
  )
}
