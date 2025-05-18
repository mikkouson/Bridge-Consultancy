"use client";

import { InvoicesSchemaType } from "@/app/types/invoices.type";
import { PaymentForm } from "@/components/payments/form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import useSWR from "swr";
import { Badge } from "./badge";
import Loader from "@/components/loader";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { data, error, isLoading } = useSWR(
    `/api/invoices/edit?id=${id}`,
    (url) => fetch(url).then((res) => res.json())
  );

  if (error) return <div className="p-8">Error loading invoice data</div>;
  if (isLoading) return <Loader />;
  const invoice = data[0];
  const payments = data[0]?.payments;
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
            <h1 className="text-xl font-semibold">Record Payment</h1>
            <p className="text-sm text-muted-foreground">
              Invoice #{invoice?.invoice_number}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {invoice?.status === "paid" && (
            <Badge variant="success" className="mr-2">
              Paid
            </Badge>
          )}
          <Link href={`/invoices/${id}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              View Invoice
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium mb-4">Payment Details</h2>
          <PaymentForm id={id} data={payments} invoice={invoice} />
        </div>

        <div>
          <InvoiceSummary invoice={invoice} />
        </div>
      </div>
    </div>
  );
};

function InvoiceSummary({ invoice }: { invoice: InvoicesSchemaType }) {
  return (
    <div className="space-y-6">
      <div className="bg-muted p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-medium">Invoice Summary</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Client
            </h3>
            <p className="font-medium">{invoice?.companies?.name}</p>
            <p className="text-sm text-muted-foreground">
              {invoice?.companies?.email}
            </p>
            <p className="text-sm text-muted-foreground">
              {invoice?.companies?.contact}
            </p>
          </div>

          <hr className="border-border" />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Invoice Details
            </h3>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-sm text-muted-foreground">Invoice Date:</p>
              <p className="text-sm text-right">
                {new Date(invoice?.date).toLocaleDateString()}
              </p>

              <p className="text-sm text-muted-foreground">Subject:</p>
              <p className="text-sm text-right">{invoice?.subject}</p>

              <p className="text-sm text-muted-foreground">TRN:</p>
              <p className="text-sm text-right">{invoice?.trn}</p>
            </div>
          </div>

          <hr className="border-border" />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Payment Summary
            </h3>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-sm text-muted-foreground">Subtotal:</p>
              <p className="text-sm text-right">
                {invoice?.currency} {(invoice?.amount ?? 0).toFixed(2)}
              </p>

              <p className="text-sm text-muted-foreground">VAT:</p>
              <p className="text-sm text-right">
                {invoice?.currency}{" "}
                {(invoice?.total_vat_amount ?? 0).toFixed(2)}
              </p>

              <p className="text-sm font-medium">Total:</p>
              <p className="text-sm font-medium text-right">
                {invoice?.currency} {(invoice?.total_amount ?? 0).toFixed(2)}
              </p>

              <p className="text-sm text-muted-foreground">Paid:</p>
              <p className="text-sm text-green-600 text-right">
                {invoice?.currency} {(invoice?.paid ?? 0).toFixed(2)}
              </p>

              <p className="text-sm text-muted-foreground">Balance:</p>
              <p
                className={`text-sm text-right ${
                  (invoice?.balance ?? 0) < 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {(invoice?.balance ?? 0) < 0 ? "-" : ""}
                {invoice?.currency} {Math.abs(invoice?.balance ?? 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Services</h3>
        {invoice?.invoice_services?.map((service) => (
          <div
            key={service.id}
            className="border border-border rounded-lg p-4 bg-card"
          >
            <p className="font-medium">{service.service_name}</p>
            <div className="flex justify-between mt-1">
              <p className="text-sm text-muted-foreground">
                Date: {new Date(service.service_date).toLocaleDateString()}
              </p>
              <p className="text-sm font-medium">
                {invoice?.currency} {(service?.base_amount ?? 0).toFixed(2)}
              </p>
            </div>
            <div className="text-sm text-muted-foreground text-right">
              VAT: {invoice?.currency} {service.service_vat_amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
