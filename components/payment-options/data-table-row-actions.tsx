"use client";

import { Row } from "@tanstack/react-table";
import { DeleteConfirmationDialog } from "@/components/delete-dialog";
import { SheetModal } from "@/components/sheet-modal";
import { PaymentOptionsSchemaType } from "@/app/types/payment-options.type";
import { deletePaymentOption } from "@/app/(admin)/payment-options/actions";
import { PaymentOptionsForm } from "./form";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends PaymentOptionsSchemaType>({
  row,
}: DataTableRowActionsProps<TData>) {
  return (
    <div className="flex items-center justify-start ">
      <SheetModal
        triggerLabel="New Payment Option"
        title="Add Payment Option"
        description="Enter the details to add a new payment option."
        edit={true}
      >
        {(setOpen) => (
          <PaymentOptionsForm
            data={row.original}
            setOpen={setOpen}
            action="edit"
          />
        )}
      </SheetModal>
      <DeleteConfirmationDialog
        onConfirm={async () => {
          await deletePaymentOption((row.original as { id: number }).id);
        }}
        title="Delete Payment Option?"
        description="This will permanently remove the payment option."
      />
    </div>
  );
}
