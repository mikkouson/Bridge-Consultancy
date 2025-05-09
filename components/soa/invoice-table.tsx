"use client";

import { useInvoice } from "@/app/hooks/use-invoices";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import InvoiceCard from "./invoice-card";
import { InvoicesSchemaType } from "@/app/types/invoices.type";
import { Skeleton } from "../ui/skeleton";

export default function InvoiceSheet() {
  const { data: invoiceData, isLoading, error } = useInvoice();
  if (isLoading) {
    return (
      <div className="w-full mt-2">
        <div className="mb-4 flex h-10 items-center justify-start rounded-md bg-muted p-1">
          <Skeleton className="h-8 w-32 rounded-sm" />
          <Skeleton className="h-8 w-32 ml-1 rounded-sm" />
          <Skeleton className="h-8 w-32 ml-1 rounded-sm" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }
  if (error) return <>err</>;

  // Filter invoices directly in the render function
  const unpaidInvoices = invoiceData.filter(
    (invoice: InvoicesSchemaType) =>
      invoice.status === "pending" || invoice.status === "partially"
  );
  const pendingInvoices = invoiceData.filter(
    (invoice: InvoicesSchemaType) => invoice.status === "pending"
  );
  const partiallyPaidInvoices = invoiceData.filter(
    (invoice: InvoicesSchemaType) => invoice.status === "partially"
  );

  return (
    <Tabs defaultValue="all" className="w-full mt-2">
      <TabsList className="mb-4">
        <TabsTrigger value="all">
          All Unpaid ({unpaidInvoices.length})
        </TabsTrigger>
        <TabsTrigger value="pending">
          Pending ({pendingInvoices.length})
        </TabsTrigger>
        <TabsTrigger value="partially">
          Partially Paid ({partiallyPaidInvoices.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        {unpaidInvoices.length > 0 ? (
          unpaidInvoices.map((invoice: InvoicesSchemaType) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-10">
            No unpaid invoices found
          </p>
        )}
      </TabsContent>

      <TabsContent value="pending" className="space-y-4">
        {pendingInvoices.length > 0 ? (
          pendingInvoices.map((invoice: InvoicesSchemaType) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-10">
            No pending invoices found
          </p>
        )}
      </TabsContent>

      <TabsContent value="partially" className="space-y-4">
        {partiallyPaidInvoices.length > 0 ? (
          partiallyPaidInvoices.map((invoice: InvoicesSchemaType) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-10">
            No partially paid invoices found
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
