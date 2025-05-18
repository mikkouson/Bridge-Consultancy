"use client";

import { deleteInvoice } from "@/app/(admin)/invoices/actions";
import { InvoicesSchemaType } from "@/app/types/invoices.type";
import { DeleteConfirmationDialog } from "@/components/delete-dialog";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import InvoicePage from "../pdf/pdf_buttons";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends InvoicesSchemaType>({
  row,
}: DataTableRowActionsProps<TData>) {
  return (
    <div className="flex items-center justify-start ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={`/invoices/edit/${row.original.id}`}>
            <Button variant="ghost" className="w-full justify-start">
              Edit
            </Button>
          </Link>
          <DeleteConfirmationDialog
            button={true}
            onConfirm={async () => {
              await deleteInvoice((row.original as { id: number }).id);
            }}
            title="Delete Invoice?"
            description="This will permanently remove the service."
          />

          {row.original && <InvoicePage invoiceData={row.original} />}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
