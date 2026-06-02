import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, type SortingState, useReactTable, type VisibilityState } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { DataTablePagination } from "../pagination"
import { ISchedulerData } from "@/lib/types/data"
import { DataTableProps } from "@/lib/types/props"
import { DataTableViewOptions } from "../col-toggle"
import { useTranslation } from "react-i18next"
import { GET_SCHEDULER_COLS } from "../columns/scheduler"
import { ISchedulerState } from "@/lib/types/states"

export function SchedulerTable({data, headerElement, setState}: DataTableProps<ISchedulerData<"state">> & {
  setState: (overrides: Partial<ISchedulerState>) => void,
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = GET_SCHEDULER_COLS(setState)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility
    }
  })
  const {t} = useTranslation("table")
  return (
    <>
    <div className="flex items-center justify-between gap-4 w-full">
      {headerElement}
      <DataTableViewOptions table={table}/>
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
                {t("not-found.scheduler")}
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