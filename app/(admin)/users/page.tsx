"use client";

import { useUsers } from "@/app/hooks/use-users";
import { columns } from "@/components/users/columns";
import { DataTable } from "@/components/users/data-table";

export default function TaskPage() {
  const { data } = useUsers();
  return (
    <div className=" h-full flex-1 flex-col space-y-8 px-2 flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users Page</h2>
          <p className="text-muted-foreground">
            Manage and track your available services
          </p>
        </div>
      </div>
      {data && <DataTable data={data} columns={columns} />}
    </div>
  );
}
