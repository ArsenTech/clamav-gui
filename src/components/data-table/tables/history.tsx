import {
  flexRender,
  getCoreRowModel,
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
import { Braces, Download, File, RotateCcw, Trash2 } from "lucide-react"
import { DataTablePagination } from "../pagination"
import { Badge } from "../../ui/badge"
import { DataTableViewOptions } from "../col-toggle"
import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTableProps, HistoryStatus } from "@/lib/types"
import { capitalizeText } from "@/lib/helpers"

export function HistoryTable<TData, TValue>({columns,data}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
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

  const getBadgeValue = (cellValue: HistoryStatus) =>
    cellValue === "warning" ? "warning" : 
    cellValue === "error" ? "destructive" : "success";

  return (
    <>
    <div className="flex items-center justify-between gap-4 w-full">
      <ButtonGroup>
        <Button>
          <RotateCcw/> Refresh
        </Button>
        <Button variant="outline">
          <Trash2/> Clear history
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download/> Export History
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <File/> Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Braces /> Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
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
                    {cell.column.id === "status" ? <Badge variant={getBadgeValue(cell.getValue() as HistoryStatus)}>
                      {capitalizeText(cell.getValue() as string)}
                    </Badge> : flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
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