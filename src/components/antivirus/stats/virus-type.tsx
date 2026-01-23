import { Bug } from "lucide-react"
import { Pie, PieChart } from "recharts"
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
import { VIRUS_TYPE_CONFIG } from "@/lib/constants/chart"
import { ChartProps, IVirusTypeStat } from "@/lib/types"
import { NoData } from "./no-data"

export function VirusTypes({data}: ChartProps<IVirusTypeStat[]>) {
  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex items-center gap-2"><Bug className="size-5"/> Threats by Malware Type</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {!data.length ? (
          <NoData/>
        ) : (
          <ChartContainer
            config={VIRUS_TYPE_CONFIG}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="threats"
                nameKey="virus_type"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
