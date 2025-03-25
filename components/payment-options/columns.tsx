"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { PaymentOptionsSchemaType } from "@/app/types/payment-options.type";
export const columns: ColumnDef<PaymentOptionsSchemaType>[] = [
  {
    accessorKey: "bank_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bank Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] truncate font-medium">
        {row.getValue("bank_name")}
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
    accessorKey: "account_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] truncate font-medium">
        {row.getValue("account_name")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "iban",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Iban" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] truncate font-medium">
        {row.getValue("iban")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "swift_code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Swift/BIC Code" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] truncate font-medium">
        {row.getValue("swift_code")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "bank_address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bank Address" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] truncate font-medium">
        {row.getValue("bank_address")}
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
