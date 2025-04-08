// (admin)/invoices/edit/page.tsx
"use client";

import { InvoicesForm } from "@/components/invoices/form";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useInvoice } from "@/app/hooks/use-invoices";

const PageContent = () => {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("id");
  const { data } = useInvoice();

  if (!data) return <p>Loading...</p>;

  const invoice = data.find((i: { id: number }) => String(i.id) === invoiceId);

  return <InvoicesForm data={invoice} action="edit" />;
};

const Page = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PageContent />
    </Suspense>
  );
};

export default Page;
