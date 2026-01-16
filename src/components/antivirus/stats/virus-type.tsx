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
import { VIRUS_TYPE_DATA } from "@/lib/constants/chart-data"

export function VirusTypes() {
  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex items-center gap-2"><Bug className="size-5"/> Computer Virus Types</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
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
              data={VIRUS_TYPE_DATA}
              dataKey="threats"
              nameKey="type"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
