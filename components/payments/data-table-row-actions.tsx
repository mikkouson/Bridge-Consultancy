"use client";

import { Row } from "@tanstack/react-table";
import { PaymentsSchemaType } from "@/app/types/payments";

// import { DeleteConfirmationDialog } from "@/components/delete-dialog";
// import { deleteService } from "../../app/(admin)/services/actions";
// import { SheetModal } from "@/components/sheet-modal";
// // import { ServiceForm } from "./form";

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
      </SheetModal>
      <DeleteConfirmationDialog
        onConfirm={async () => {
          await deleteService((row.original as { id: number }).id);
        }}
        title="Delete Service?"
        description="This will permanently remove the service."
      /> */}
    </div>
  );
}
