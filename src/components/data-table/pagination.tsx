import type { Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslation } from "react-i18next"
import { useMemo } from "react"

interface Props<TData> {
  table: Table<TData>
}
export function DataTablePagination<TData>({table}: Props<TData>) {
  const {t} = useTranslation("table")
  const paginationCount = useMemo(()=>t("pagination.rows-count",{
    selected: table.getFilteredSelectedRowModel().rows.length,
    filtered: table.getFilteredRowModel().rows.length
  }),[
    table,
    t
  ])
  return (
    <div className="flex items-center justify-between px-2 w-full">
      <div className="text-muted-foreground flex-1 text-sm">
        {paginationCount}
      </div>
      <div className="flex items-center gap-x-6 lg:gap-x-8">
        <div className="flex items-center gap-x-2">
          <p className="text-sm font-medium">{t("pagination.row-per-page")}</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {t("pagination.page-count",{
            index: table.getState().pagination.pageIndex + 1,
            count: table.getPageCount()
          })}
        </div>
        <div className="flex items-center gap-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t("pagination.buttons.first")}</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t("pagination.buttons.previous")}</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t("pagination.buttons.next")}</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t("pagination.buttons.last")}</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
