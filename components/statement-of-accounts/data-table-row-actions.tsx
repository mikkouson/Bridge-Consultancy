"use client";

import { Row } from "@tanstack/react-table";
import { SoaSchemaType } from "@/app/types/soa";
import { DeleteConfirmationDialog } from "@/components/delete-dialog";
import Link from "next/link";
import { FilePenLine } from "lucide-react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends SoaSchemaType>({
  row,
}: DataTableRowActionsProps<TData>) {
  return (
    <div className="flex items-center justify-start">
      <Link href={`soa/edit/${row.original.id}`}>
        <FilePenLine className="cursor-pointer text-gray-600 hover:text-green-500" />
      </Link>
      <DeleteConfirmationDialog
        onConfirm={async () => {
          // TODO: Implement delete functionality
          console.log("Delete statement", row.original.id);
        }}
        title="Delete Statement?"
        description="This will permanently remove the statement."
      />
    </div>
  );
}
