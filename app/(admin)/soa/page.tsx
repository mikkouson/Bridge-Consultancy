"use client";

import { useSOA } from "@/app/hooks/use-soa";
import { columns } from "@/components/statement-of-accounts/columns";
import { DataTable } from "@/components/statement-of-accounts/data-table";

export default function PaymentOptionsPage() {
  const { data } = useSOA();
  return (
    <div className="h-full flex-1 flex-col space-y-8 px-2 flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payment Options</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of available payment options.
          </p>
        </div>
      </div>
      {data && <DataTable data={data} columns={columns} />}
    </div>
  );
}
