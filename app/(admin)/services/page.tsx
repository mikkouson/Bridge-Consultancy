"use client";
import { columns } from "../../../components/services/columns";
import { DataTable } from "../../../components/services/data-table";
import { useServices } from "@/app/hooks/use-services";
import Loader from "@/components/loader";

export default function TaskPage() {
  const { data, isLoading } = useServices();
  if (isLoading) return <Loader />;

  return (
    <div className=" h-full flex-1 flex-col space-y-8 px-2 flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Services Page</h2>
          <p className="text-muted-foreground">
            Manage and track your available services
          </p>
        </div>
      </div>
      {data && <DataTable data={data} columns={columns} />}
    </div>
  );
}
