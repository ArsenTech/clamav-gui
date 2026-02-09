import { ColumnDef } from "@tanstack/react-table"
import { ScanProfileId } from "./settings"
import { TFunction } from "i18next"

export interface TableLoaderProps{
     rows: number
}
export interface SettingsProps{
     scanProfile: ScanProfileId
}
export interface RealTimeChartProps{
     t: TFunction<"stats">
}
export interface ChartProps<T> extends RealTimeChartProps{
     data: T,
}
export interface DataTableProps<TData> {
     columns: ColumnDef<TData>[]
     data: TData[],
     searchColumn?: string,
     headerElement?: React.JSX.Element
}