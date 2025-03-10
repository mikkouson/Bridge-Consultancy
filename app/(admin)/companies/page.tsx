"use client";
import { InputForm } from "@/components/input";
import useSWR from "swr";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

export default function TaskPage() {
  // const tasks = await getTasks();
  const { data } = useSWR("/api/companies", (url) =>
    fetch(url).then((res) => res.json())
  );

  return (
    <>
      <div className=" h-full flex-1 flex-col space-y-8 p-8 flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Companies Page
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your handled companies
            </p>
          </div>
        </div>
        <InputForm />
        {data && <DataTable data={data} columns={columns} />}
      </div>
    </>
  );
}
