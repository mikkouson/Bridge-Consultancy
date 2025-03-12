"use client";

import { Row } from "@tanstack/react-table";

import { AlertDialogDemo } from "@/components/alert";
import { EditCompanySheet } from "@/components/companies/edit-company-sheet";
import { CompanySchemaType } from "@/app/types/companies.type";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends CompanySchemaType>({
  row,
}: DataTableRowActionsProps<TData>) {
  return (
    <div className="flex items-center justify-start ">
      <EditCompanySheet data={row.original} />
      <AlertDialogDemo id={(row.original as { id: number }).id} />
    </div>
  );
}
