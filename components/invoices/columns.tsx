"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { DataTableColumnHeader } from "../data-table-column-header";
import { InvoicesSchemaType } from "@/app/types/invoices.type";
import moment from "moment";

export const columns: ColumnDef<InvoicesSchemaType>[] = [
  {
    accessorKey: "invoice_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice Number" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] truncate font-medium">
        {row.getValue("invoice_number")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    filterFn: (row, columnId, filterValue) => {
      const cellValue = row.getValue(columnId) as string;
      return cellValue?.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] truncate font-medium">
        {row.original.companies?.name || "N/A"}
        {/* {row.getValue("company")} */}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice Date" />
    ),
    cell: ({ row }) => {
      const formattedDate = moment(row.getValue("date")).format("MMMM D, YYYY"); // Example: September 7, 2024
      return (
        <div className="w-[120px] truncate font-medium">{formattedDate}</div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "payment_option",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Option" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] truncate font-medium">
        {row.getValue("payment_option")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "vat",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vat" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] truncate font-medium">
        {row.getValue("vat")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
