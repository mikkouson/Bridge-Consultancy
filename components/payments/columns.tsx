"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import moment from "moment";
import { PaymentsSchemaType } from "@/app/types/payments";

export const columns: ColumnDef<PaymentsSchemaType>[] = [
  {
    accessorKey: "invoice_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice Number" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] truncate font-medium">
        {row.original?.invoices?.invoice_number || "N/A"}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    filterFn: (row, columnId, filterValue) => {
      // Access nested invoice_number through the invoices object
      const invoiceNumber = row.original?.invoices?.invoice_number;
      if (!invoiceNumber) return false;
      return invoiceNumber.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "payment_method",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Mode" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] truncate font-medium">
        {row.getValue("payment_method")}{" "}
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
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const currencyCode = row.original?.invoices?.currency || "N/A";

      const currencySymbols: Record<string, string> = {
        USD: "$",
        EUR: "€",
        AED: "د.إ",
        // add more as needed
      };

      const symbol = currencySymbols[currencyCode] || currencyCode;

      return (
        <div className="w-[120px] truncate font-medium flex gap-1">
          <span className="font-semibold">{symbol}</span>

          {row.getValue("amount")}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "comment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comment" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] truncate font-medium">
        {row.getValue("comment") ? row.getValue("comment") : "-"}
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
