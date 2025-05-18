"use client";

import { usePaymentOptions } from "@/app/hooks/use-payment-options";
import Loader from "@/components/loader";
import { columns } from "@/components/payment-options/columns";
import { DataTable } from "@/components/payment-options/data-table";

export default function PaymentOptionsPage() {
  const { data, isLoading } = usePaymentOptions();
  if (isLoading) return <Loader />;
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
