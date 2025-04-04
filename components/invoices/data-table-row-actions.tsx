"use client";

import { Row } from "@tanstack/react-table";
import { DeleteConfirmationDialog } from "@/components/delete-dialog";
import { SheetModal } from "@/components/sheet-modal";
import { InvoicesForm } from "./form";
import { deleteInvoice } from "@/app/(admin)/invoices/actions";
import { InvoicesSchemaType } from "@/app/types/invoices.type";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends InvoicesSchemaType>({
  row,
}: DataTableRowActionsProps<TData>) {
  return (
    <div className="flex items-center justify-start ">
      <SheetModal
        triggerLabel="Create Company"
        title="Create Company"
        description="Fill in the details to create a new company."
        edit={true}
      >
        {(setOpen) => (
          <InvoicesForm data={row.original} setOpen={setOpen} action="edit" />
        )}
      </SheetModal>
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
