"use client";
import { useCustomer } from "@/app/hooks/use-company";
import { columns } from "@/components/customer/columns";
import { DataTable } from "@/components/customer/data-table";

export default function TaskPage() {
  const { data } = useCustomer();
  return (
    <div className=" h-full flex-1 flex-col space-y-8 px-2 flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customers Page</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your handled customers
          </p>
        </div>
      </div>
      {data && <DataTable data={data} columns={columns} />}
    </div>
  );
}
