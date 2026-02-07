import { ColumnDef } from "@tanstack/react-table"
import { ScanProfileId } from "./settings"

export interface TableLoaderProps{
     rows: number
}
export interface SettingsProps{
     scanProfile: ScanProfileId
}
export interface ChartProps<T>{
     data: T
}
export interface DataTableProps<TData> {
     columns: ColumnDef<TData>[]
     data: TData[],
     searchColumn?: string,
     headerElement?: React.JSX.Element
}