"use client";

import { Row } from "@tanstack/react-table";
import { SoaSchemaType } from "@/app/types/soa";
import { DeleteConfirmationDialog } from "@/components/delete-dialog";
import Link from "next/link";
import { FilePenLine } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import StatementPage from "../pdf/soa-pdf_buttons";
import { deleteStatment } from "@/app/(admin)/soa/actions";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends SoaSchemaType>({
  row,
}: DataTableRowActionsProps<TData>) {
  return (
    <div className="flex items-center justify-start">
      {/* <Link href={`soa/edit/${row.original.id}`}>
        <FilePenLine className="cursor-pointer text-gray-600 hover:text-green-500" />
      </Link>
      <DeleteConfirmationDialog
        onConfirm={async () => {
          // TODO: Implement delete functionality
          console.log("Delete statement", row.original.id);
        }}
        title="Delete Statement?"
        description="This will permanently remove the statement."
      /> */}
      {/* {JSON.stringify(row.original, null, 2)} */}

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
          {/* <Link href={`/invoices/edit/${row.original.id}`}>
            <Button variant="ghost" className="w-full justify-start">
              Edit
            </Button>
          </Link> */}
          <DeleteConfirmationDialog
            button={true}
            onConfirm={async () => {
              await deleteStatment((row.original as { id: number }).id);
            }}
            title="Delete Invoice?"
            description="This will permanently remove this statement."
          />
          {row.original && <StatementPage statementData={row.original} />}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
