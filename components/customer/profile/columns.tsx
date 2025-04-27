"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InvoicesSchemaType } from "@/app/types/invoices.type";
import moment from "moment";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Badge } from "@/app/(admin)/payments/[id]/badge";
import { DataTableRowActions } from "@/components/invoices/data-table-row-actions";

export const columns: ColumnDef<InvoicesSchemaType>[] = [
  // Other columns remain unchanged
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
  },

  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] truncate font-medium">
        {row.original.companies?.company_name || "N/A"}
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
      const formattedDate = moment(row.getValue("date")).format("MMMM D, YYYY");
      return (
        <div className="w-[120px] truncate font-medium">{formattedDate}</div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "payment_option",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Option" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] truncate font-medium">
        {row.original.payment_options?.bank_name || "N/A"}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "currency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Currency" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] truncate font-medium">
        {row.getValue("currency")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const badgeMap: Record<
        string,
        { label: string; color: string; background: string }
      > = {
        pending: {
          label: "Pending",
          color: "bg-yellow-500",
          background: "bg-yellow-500",
        },
        "partially paid": {
          label: "Partially Paid",
          color: "bg-orange-500",
          background: "bg-orange-200",
        },
        paid: {
          label: "Paid",
          color: "bg-emerald-500",
          background: "bg-emerald-200",
        },
      };

      const badge = badgeMap[status.toLowerCase()] ?? {
        label: status,
        color: "bg-gray-400",
        background: "bg-gray-200",
      };

      return (
        <div className="w-[120px] truncate font-medium flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 flex items-center">
            <span
              className={`size-1.5 rounded-full ${badge.color} ${badge.background}`}
              aria-hidden="true"
            ></span>
            {badge.label}
          </Badge>
        </div>
      );
    },
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
