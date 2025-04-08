"use client";

import { deleteInvoice } from "@/app/(admin)/invoices/actions";
import { InvoicesSchemaType } from "@/app/types/invoices.type";
import { DeleteConfirmationDialog } from "@/components/delete-dialog";
import { Row } from "@tanstack/react-table";
import { FilePenLine } from "lucide-react";
import Link from "next/link";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends InvoicesSchemaType>({
  row,
}: DataTableRowActionsProps<TData>) {
  return (
    <div className="flex items-center justify-start ">
      <Link href={`/invoices/edit?id=${row.original.id}`}>
        <FilePenLine className="cursor-pointer text-gray-600 hover:text-green-500" />
      </Link>

      <DeleteConfirmationDialog
        onConfirm={async () => {
          await deleteInvoice((row.original as { id: number }).id);
        }}
        title="Delete Invoice?"
        description="This will permanently remove the service."
      />
    </div>
  );
}
