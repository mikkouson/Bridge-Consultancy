"use client";
import { useInvoice } from "@/app/hooks/use-invoices";
import { InvoicesForm } from "@/components/invoices/invoice-form";
import React from "react";

const Page = () => {
  const { data } = useInvoice();

  if (!data) return <p>Loading...</p>;

  return <InvoicesForm data={data} action="create" />;
};

export default Page;
