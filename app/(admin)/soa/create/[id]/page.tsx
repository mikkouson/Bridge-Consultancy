"use client";

import Loader from "@/components/loader";
import { SoaForm } from "@/components/soa/form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import useSWR from "swr";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const {
    data: companyData,
    error: companyError,
    isLoading: companyLoading,
  } = useSWR(`/api/companies/profile?id=${id}`, (url) =>
    fetch(url).then((res) => res.json())
  );

  const invoice = companyData?.[0]?.invoices;
  if (companyError) return <div className="p-8">Error loading data</div>;
  if (companyLoading) return <Loader />;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/invoices">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold">
              Create Statement of Account
            </h1>
            <p className="text-sm text-muted-foreground">
              For {companyData[0]?.name}
            </p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-medium mb-4">Statement Details</h2>
        <SoaForm id={id} data={companyData} invoiceData={invoice} />
      </div>
    </div>
  );
};

export default Page;
