"use client";

import { InvoicesForm } from "@/components/invoices/invoice-form";
import { use } from "react";
import useSWR from "swr";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, error, isLoading } = useSWR(
    `/api/invoices/edit?id=${id}`,
    (url) => fetch(url).then((res) => res.json())
  );
  if (error) return <p>Error</p>;
  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <InvoicesForm data={data[0]} action="edit" />
    </div>
  );
}
