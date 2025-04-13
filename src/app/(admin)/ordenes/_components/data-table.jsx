"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function DataTable({ columns, data }) {
  const [columnFilters, setColumnFilters] = useState([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className="  ">
      <div className="flex gap-5">
        <div className=" py-4">
          <label
            className="block text-sm font-bold text-gray-700 mb-1 "
            htmlFor="email-filter"
          >
            N Orden
          </label>
          <Input
            placeholder="Numero Orden"
            value={table.getColumn("id")?.getFilterValue() || ""}
            onChange={(event) =>
              table.getColumn("id")?.setFilterValue(event.target.value)
            }
            className="max-w-sm bg-white"
          />
        </div>
        <div className="py-4">
          <label
            className="block text-sm font-bold text-gray-700 mb-1"
            htmlFor="email-filter"
          >
            Email
          </label>
          <Input
            id="email-filter"
            placeholder="Emails..."
            value={table.getColumn("Email")?.getFilterValue() || ""}
            onChange={(event) =>
              table.getColumn("Email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm bg-white"
          />
        </div>
        <div className=" py-4">
          <label
            className="block text-sm font-bold text-gray-700 mb-1"
            htmlFor="email-filter"
          >
            Usuario
          </label>
          <Input
            placeholder="Nombre..."
            value={table.getColumn("userName")?.getFilterValue() || ""}
            onChange={(event) =>
              table.getColumn("userName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm bg-white"
          />
        </div>
      </div>

      <Table className={"bg-[#f9fff4]"}>
        <TableHeader className={"bg-slate-900"}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  className={"bg-gray-900 text-white font-semibold text-sm"}
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
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
  );
}
