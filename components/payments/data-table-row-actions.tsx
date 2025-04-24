"use client";

import { Row } from "@tanstack/react-table";
import { PaymentsSchemaType } from "@/app/types/payments";

import { DeleteConfirmationDialog } from "@/components/delete-dialog";
import { SheetModal } from "@/components/sheet-modal";
import { deletePayment } from "@/app/(admin)/payments/actions";
import Link from "next/link";
// import { ServiceForm } from "./form";
import { FilePenLine } from "lucide-react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends PaymentsSchemaType>({
  row,
}: DataTableRowActionsProps<TData>) {
  return (
    <div className="flex items-center justify-start ">
      {/* <SheetModal
        triggerLabel="Create Company"
        title="Create Company"
        description="Fill in the details to create a new company."
        edit={true}
      >
        {(setOpen) => (
          <ServiceForm data={row.original} setOpen={setOpen} action="edit" />
        )}
      </SheetModal> */}

      <Link href={`payments/edit/${row.original.id}`}>
        <FilePenLine className=" cursor-pointer text-gray-600 hover:text-green-500 " />
      </Link>
      <DeleteConfirmationDialog
        onConfirm={async () => {
          await deletePayment((row.original as { id: number }).id);
        }}
        title="Delete Service?"
        description="This will permanently remove the service."
      />
    </div>
  );
}
