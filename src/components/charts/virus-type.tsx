import { Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { GET_VIRUS_TYPE_CONFIG } from "@/lib/constants/chart"
import { IVirusTypeStat } from "@/lib/types/stats"
import { ChartProps } from "@/lib/types/props"
import { NoData } from "./no-data"

export default function VirusTypesChart({data,t}: ChartProps<IVirusTypeStat[]>) {
  return !data.length ? (
    <NoData label={t("no-data")}/>
  ) : (
    <ChartContainer
      config={GET_VIRUS_TYPE_CONFIG(t)}
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
