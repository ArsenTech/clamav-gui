import { Search } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { SCAN_TYPE_CONFIG } from "@/lib/constants/chart"
import { ChartProps, IScanTypeStat } from "@/lib/types"
import { NoData } from "./no-data"

export function ScanTypes({data}: ChartProps<IScanTypeStat[]>) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Search className="size-5"/> Threats by Scan Type</CardTitle>
      </CardHeader>
      <CardContent>
        {!data.length ? (
          <NoData/>
        ) : (
          <ChartContainer config={SCAN_TYPE_CONFIG}>
            <BarChart
              accessibilityLayer
              data={data}
              layout="vertical"
            >
              <YAxis
                dataKey="scan_type"
                type="category"
                tickLine={false}
                tickMargin={2}
                axisLine={false}
                tickFormatter={(value) =>
                  SCAN_TYPE_CONFIG[value as keyof typeof SCAN_TYPE_CONFIG]?.label
                }
              />
              <XAxis dataKey="threats" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="threats" layout="vertical" radius={5} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
