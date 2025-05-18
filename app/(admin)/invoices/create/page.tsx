"use client";
import { useInvoice } from "@/app/hooks/use-invoices";
import { InvoicesForm } from "@/components/invoices/invoice-form";
import Loader from "@/components/loader";
import React from "react";

const Page = () => {
  const { data, isLoading } = useInvoice();

  if (isLoading) return <Loader />;

  return <InvoicesForm data={data} action="create" />;
};

export default Page;
