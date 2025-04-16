"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { CustomerSchemaType } from "@/app/types/companies.type";
import { DataTableColumnHeader } from "../data-table-column-header";
export const columns: ColumnDef<CustomerSchemaType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] truncate font-medium">
        {row.getValue("name")}
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
    accessorKey: "company_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company Name" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("company_name") as string;
      return (
        <div className="w-[150px] truncate font-medium">
          {value?.trim() ? value : "—"}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-[180px] truncate font-medium">
        {row.getValue("email")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "contact",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] truncate font-medium">
        {row.getValue("contact")}
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
