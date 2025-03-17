"use client";
import { CompanySchemaType } from "@/app/types/companies.type";
import { PdfExport } from "@/components/pdf-export";
import { SheetDemo } from "@/components/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { ArrowDownToLine, X } from "lucide-react";
import { CSVLink } from "react-csv";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData extends object> {
  table: Table<TData>;
  data: TData[];
}

export function DataTableToolbar<TData extends CompanySchemaType>({
  table,
  data,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter company name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset <X className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        {/* Export CSV */}
        <CSVLink data={data} filename="companies.csv">
          <Button variant="outline" size="sm" className="text-sm px-2">
            <ArrowDownToLine size={14} />
            <span className="sr-only sm:not-sr-only ml-2">Export CSV</span>
          </Button>
        </CSVLink>
        <PdfExport data={data} />
        <DataTableViewOptions table={table} data={data} />
        <SheetDemo />
      </div>
    </div>
  );
}
