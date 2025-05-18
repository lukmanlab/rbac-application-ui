import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "./ui/button"
import { useState } from "react"
import { Input } from "./ui/input"
import { Plus } from "lucide-react"
 
type PaginationState = {
  pageIndex: number
  pageSize: number
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination?: PaginationState
  onPageChange?: (pagination: PaginationState) => void
  isLastPage?: boolean
  columnNameFilter?: string
  showAddButton?: boolean
  onAddButton?: () => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  onPageChange,
  isLastPage,
  columnNameFilter,
  showAddButton = true,
  onAddButton
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: pagination ? true : false,
    state: {
      pagination,
      sorting,
      columnFilters
    },
    pageCount: -1,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
        ? updater(pagination || { pageIndex: 0, pageSize: 0 })
        : updater
      onPageChange?.(newPagination)
    },
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
  })
 
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        {columnNameFilter && <Input
          placeholder={`Filter ${columnNameFilter} ...`}
          value={(table.getColumn(columnNameFilter)?.getFilterValue() as string ?? "")}
          onChange={(event) => table.getColumn(columnNameFilter)?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />}
        {/* {inputButton} */}
        {showAddButton && (
          <Button onClick={onAddButton} variant="outline" size="icon">
            <Plus />
          </Button>
        )}
      </div>
      <div className="rounded-md border">
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || isLastPage}
        >
          Next
        </Button>
      </div>}
    </div>
  )
}