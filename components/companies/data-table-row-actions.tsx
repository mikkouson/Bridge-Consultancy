"use client";

import { CompanySchemaType } from "@/app/types/companies.type";
import { CompanyForm } from "@/components/companies/form";
import { DeleteConfirmationDialog } from "@/components/delete-dialog";
import { SheetModal } from "@/components/sheet-modal";
import { Row } from "@tanstack/react-table";
import { deleteCompanies } from "../../app/(admin)/companies/actions";

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
        {(setOpen) => (
          <CompanyForm data={row.original} setOpen={setOpen} action="edit" />
        )}
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
