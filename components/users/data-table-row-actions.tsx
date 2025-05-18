"use client";

import { Row } from "@tanstack/react-table";
import { DeleteConfirmationDialog } from "@/components/delete-dialog";
import { SheetModal } from "@/components/sheet-modal";
import { deleteUser } from "@/app/(admin)/users/actions";
import { UserSchemaType } from "@/app/types/user.type";
import { EditUserForm } from "./edit-user";
import { EmailModal } from "../invitation-modal";
import { Separator } from "../ui/separator";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends UserSchemaType>({
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
          <div>
            <EditUserForm data={row.original} setOpen={setOpen} action="edit" />
            <Separator orientation="horizontal" className="my-4" />
            <EmailModal action="reset" />
          </div>
        )}
      </SheetModal>
      <DeleteConfirmationDialog
        onConfirm={async () => {
          await deleteUser(row.original.id!);
        }}
        title="Delete Service?"
        description="This will permanently remove the service."
      />
    </div>
  );
}
