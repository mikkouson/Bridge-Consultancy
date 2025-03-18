"use client";

import { Row } from "@tanstack/react-table";
import { CompanySchemaType } from "@/app/types/companies.type";
import { DeleteConfirmationDialog } from "@/components/delete-dialog";
import { deleteCompanies } from "../actions";
import { SheetModal } from "@/components/sheet-modal";
import { EditCompany } from "@/components/companies/edit-company";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends CompanySchemaType>({
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
        {(setOpen) => <EditCompany data={row.original} setOpen={setOpen} />}
      </SheetModal>
      <DeleteConfirmationDialog
        onConfirm={async () => {
          await deleteCompanies((row.original as { id: number }).id);
        }}
        title="Delete Company?"
        description="This will permanently remove the company."
      />
    </div>
  );
}
