import { Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { VIRUS_TYPE_CONFIG } from "@/lib/constants/chart"
import { ChartProps, IVirusTypeStat } from "@/lib/types"
import { NoData } from "./no-data"

export default function VirusTypesChart({data}: ChartProps<IVirusTypeStat[]>) {
  return !data.length ? (
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
  )
}
