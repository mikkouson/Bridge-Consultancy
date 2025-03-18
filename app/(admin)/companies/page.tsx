"use client";
import { useCompany } from "@/app/hooks/use-company";
import { columns } from "../../../components/companies/columns";
import { DataTable } from "../../../components/companies/data-table";

export default function TaskPage() {
  // const tasks = await getTasks();

  const { data } = useCompany();
  return (
    <div className=" h-full flex-1 flex-col space-y-8 px-2 flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Companies Page</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your handled companies
          </p>
        </div>
      </div>
      {data && <DataTable data={data} columns={columns} />}
    </div>
  );
}
