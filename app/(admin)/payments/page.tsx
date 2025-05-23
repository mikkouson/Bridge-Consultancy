"use client";

import { usePayment } from "@/app/hooks/use-payment";
import { columns } from "@/components/payments/columns";
import { DataTable } from "@/components/payments/data-table";
import Loader from "@/components/loader";

export default function PaymentOptionsPage() {
  const { data, isLoading } = usePayment();
  if (isLoading) return <Loader />;

  return (
    <div className="h-full flex-1 flex-col space-y-8 px-2 flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payments Page</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of available payment options.
          </p>
        </div>
      </div>
      {data && <DataTable data={data} columns={columns} />}
    </div>
  );
}
