"use client";
import { PaymentsSchemaType } from "@/app/types/payments";
import { PdfExport } from "@/components/pdf-export";
import { SheetModal } from "@/components/sheet-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table } from "@tanstack/react-table";
import { ArrowDownToLine, X } from "lucide-react";
import { CSVLink } from "react-csv";
import InvoiceSheet from "./invoice-table";
import { Input } from "../ui/input";

interface DataTableToolbarProps<TData extends object> {
  table: Table<TData>;
  data: TData[];
}

export function DataTableToolbar<TData extends PaymentsSchemaType>({
  table,
  data,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter invoice number..."
          value={
            (table.getColumn("invoice_number")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn("invoice_number")
              ?.setFilterValue(event.target.value)
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
        {data.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto hidden h-8 lg:flex"
              >
                <ArrowDownToLine />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              <DropdownMenuLabel>Select Type</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <CSVLink
                    data={data}
                    filename="services.csv"
                    className="w-full"
                  >
                    CSV
                  </CSVLink>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PdfExport
                    title="Services Report"
                    data={data}
                    fileName="services_report.pdf"
                  />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <SheetModal
          triggerLabel="Record Payment"
          title="Record Payment"
          description="Choose invoice to redirect to record payment page."
        >
          {() => <InvoiceSheet />}
        </SheetModal>
      </div>
    </div>
  );
}
