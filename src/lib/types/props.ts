import { ColumnDef } from "@tanstack/react-table"
import { ScanProfile } from "./enums"

export interface TableLoaderProps{
     rows: number
}
export interface SettingsProps{
     scanProfile: ScanProfile
}
export interface ChartProps<T>{
     data: T,
}
export interface DataTableProps<TData> {
     columns: ColumnDef<TData>[]
     data: TData[],
     searchColumn?: string,
     headerElement?: React.JSX.Element
}