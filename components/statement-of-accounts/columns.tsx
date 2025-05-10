"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import moment from "moment";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SoaSchemaType } from "@/app/types/soa";

// Extend the SoaSchemaType to include the additional properties we need
type ExtendedSoaType = SoaSchemaType & {
  company_id?: {
    id: number;
    name: string;
    company_name: string;
  };
  invoices?: {
    invoice_number: string;
  };
  amount_due?: number;
};

export const columns: ColumnDef<ExtendedSoaType>[] = [
  {
    accessorKey: "statement_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Statement Number" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] truncate font-medium">
        {row.getValue("statement_number")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    filterFn: (row, columnId, filterValue) => {
      const statmentNumber = row.original?.statement_number;
      if (!statmentNumber) return false;
      return statmentNumber.toLowerCase().includes(filterValue.toLowerCase());
    },
  },

  {
    accessorKey: "statement_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Statement Date" />
    ),
    cell: ({ row }) => {
      const formattedDate = moment(row.getValue("statement_date")).format(
        "MMMM D, YYYY"
      );
      return (
        <div className="w-[120px] truncate font-medium">{formattedDate}</div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "amount_due",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount Due" />
    ),
    cell: ({ row }) => {
      const currencyCode = row.original?.currency || "N/A";

      const currencySymbols: Record<string, string> = {
        USD: "$",
        EUR: "€",
        AED: "د.إ",
      };

      const symbol = currencySymbols[currencyCode] || currencyCode;

      return (
        <div className="w-[120px] truncate font-medium flex gap-1">
          <span className="font-semibold">{symbol}</span>
          {row.original.amount_due || 0}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => (
      <Link
        href={`customers/${row.original.company_id?.id}`}
        className="w-[150px] truncate font-medium text-blue-600 hover:underline flex items-center gap-1"
      >
        <span className="truncate">
          {row.original.company_id?.name || "N/A"}
        </span>
        <ExternalLink size={12} />
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
    filterFn: (row, id, filterValue) => {
      const companyName = row.original.company_id?.name || "";
      return companyName.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] truncate font-medium">
        {row.original.company_id?.company_name || "N/A"}
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
