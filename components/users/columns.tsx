"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { DataTableColumnHeader } from "../data-table-column-header";
import { UserSchemaType } from "@/app/types/user.type";
export const columns: ColumnDef<UserSchemaType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
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
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] truncate font-medium">
        {row.getValue("email")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] truncate font-medium">
        {row.getValue("role")}
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
