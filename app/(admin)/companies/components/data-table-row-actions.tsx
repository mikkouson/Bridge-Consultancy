"use client";

import { Row } from "@tanstack/react-table";
import { EditCompanySheet } from "@/components/companies/edit-company-sheet";
import { CompanySchemaType } from "@/app/types/companies.type";
import { DeleteConfirmationDialog } from "@/components/delete-dialog";
import { deleteCompanies } from "../actions";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends CompanySchemaType>({
  row,
}: DataTableRowActionsProps<TData>) {
  return (
    <div className="flex items-center justify-start ">
      <EditCompanySheet data={row.original} />
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
