"use client";

import { CustomerSchemaType } from "@/app/types/companies.type";
import { DeleteConfirmationDialog } from "@/components/delete-dialog";
import { SheetModal } from "@/components/sheet-modal";
import { Row } from "@tanstack/react-table";
import { deleteCustomer } from "../../app/(admin)/customers/actions";
import { CustomerForm } from "./form";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends CustomerSchemaType>({
  row,
}: DataTableRowActionsProps<TData>) {
  return (
    <div className="flex items-center justify-start ">
      <SheetModal
        triggerLabel="Create Customer"
        title="Create Customer"
        description="Fill in the details to create a new customer."
        edit={true}
      >
        {(setOpen) => (
          <CustomerForm data={row.original} setOpen={setOpen} action="edit" />
        )}
      </SheetModal>
      <DeleteConfirmationDialog
        onConfirm={async () => {
          await deleteCustomer((row.original as { id: number }).id);
        }}
        title="Delete Customer?"
        description="This will permanently remove the customer."
      />
    </div>
  );
}
