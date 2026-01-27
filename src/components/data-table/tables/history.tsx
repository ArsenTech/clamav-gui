import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { DataTablePagination } from "../pagination"
import { DataTableProps, HistoryStatus, IHistoryData } from "@/lib/types"
import { DataTableViewOptions } from "../col-toggle"
import { ButtonGroup } from "@/components/ui/button-group"
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, CircleAlert, Eye, Shield, TriangleAlert } from "lucide-react"

export function HistoryTable({columns,data,headerElement}: DataTableProps<IHistoryData<"state">>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnVisibility,
      columnFilters
    }
  })

  const handleChangeFilters = (value: Exclude<HistoryStatus,"acknowledged"> | "all") => {
    const statusCol = table.getColumn("status");
    if(!statusCol) return;
    statusCol.setFilterValue(value==="all" ? "" : value)
  }

  return (
    <>
    <div className="flex items-center justify-between gap-4 w-full">
      {headerElement}
      <ButtonGroup>
        <Select defaultValue="all" onValueChange={val=>handleChangeFilters(val as Exclude<HistoryStatus,"acknowledged"> | "all")}>
          <SelectTrigger>
            <SelectValue placeholder="Filter Status By"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all"><Shield/> All</SelectItem>
            <SelectSeparator/>
            <SelectItem value="success"><CheckCircle/> Success</SelectItem>
            <SelectItem value="warning"><TriangleAlert/> Warning</SelectItem>
            <SelectItem value="error"><CircleAlert/> Error</SelectItem>
            <SelectItem value="acknowledged"><Eye/> Acknowledged</SelectItem>
          </SelectContent>
        </Select>
        <DataTableViewOptions table={table}/>
      </ButtonGroup>
    </div>
    <div className="overflow-hidden rounded-md w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No entries found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <DataTablePagination
      table={table}
    />
    </>
  )
}