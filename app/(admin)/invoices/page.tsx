"use client";

import { useInvoice } from "@/app/hooks/use-invoices";
import { columns } from "@/components/invoices/columns";
import { DataTable } from "@/components/invoices/data-table";

export default function TaskPage() {
  const { data } = useInvoice();

  return (
    <div className=" h-full flex-1 flex-col space-y-8 px-2 flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Invoice Page </h2>
          <p className="text-muted-foreground">
            Manage and track your available invoices
          </p>
        </div>
      </div>
      {data && <DataTable data={data} columns={columns} />}
    </div>
  );
}
