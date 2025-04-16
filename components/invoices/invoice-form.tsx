"use client";

import {
  InvoicesSchema,
  type InvoicesSchemaType,
} from "@/app/types/invoices.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import type { z } from "zod";
import { CheckCircle, CircleAlert, Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { createInvoice, updateInvoice } from "@/app/(admin)/invoices/actions";
import { useEffect } from "react";
import useSWR from "swr";

import { InvoiceDetailsSection } from "./invoice-details-section";
import { InvoiceSummarySection } from "./invoice-summary-section";
import { ServiceSheetModal } from "../servicesheet";
import ServiceSelection from "./service-selection";

export function InvoicesForm({
  data,
  action,
}: {
  data?: InvoicesSchemaType;
  action?: "create" | "edit";
}) {
  const { data: curr } = useSWR(
    "https://api.fxratesapi.com/latest?currencies=USD,EUR&base=AED&api_key=fxr_live_8e199f68b4848badf957957345368a4b4e12",
    (url) => fetch(url).then((res) => res.json())
  );

  const router = useRouter();

  const form = useForm<InvoicesSchemaType>({
    resolver: zodResolver(InvoicesSchema),
    defaultValues: {
      id: data?.id ?? 0,
      deleted_at: data?.deleted_at ?? null,
      company: data?.company ?? undefined,
      invoice_number: data?.invoice_number ?? "",
      date: data?.date ? new Date(data.date) : undefined,
      payment_option: data?.payment_option ?? undefined,
      exchange_rate: data?.exchange_rate ?? 1,
      subject: data?.subject ?? "",
      invoice_type: data?.invoice_type ?? "",
      trn: data?.trn ?? 0,
      currency: data?.currency ?? "AED",
      services: data?.invoice_services?.length
        ? data.invoice_services.map((service) => ({
            id: service.id,
            amount: service.base_amount,
            service_id: service.service_id,
            service_vat: service.service_vat,
            service_date: service.service_date
              ? new Date(service.service_date)
              : undefined,
            service_name: service.service_name,
            service_vat_amount: service.service_vat_amount,
            service_deleted_at: service.deleted_at || undefined,
          }))
        : [],
    },
  });

  const currencyId = form.watch("currency") || "AED";
  const currency = form.watch("exchange_rate");
  const services = form.getValues().services || [];

  // Update exchange rate when currency changes
  useEffect(() => {
    if (currencyId && curr?.rates) {
      const newRate = curr.rates[currencyId] ?? 1;

      if (newRate !== form.getValues("exchange_rate")) {
        form.setValue("exchange_rate", Number(newRate), {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [curr, currencyId, form]);

  async function onSubmit(data: z.infer<typeof InvoicesSchema>) {
    try {
      if (action === "edit") {
        await updateInvoice(data);
      } else {
        await createInvoice(data);
      }
      toast({
        variant: "success",
        className: "border-0",
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span>Completed successfully!</span>
          </div>
        ),
        duration: 2000,
      });

      router.push("/invoices");
    } catch (error) {
      toast({
        variant: "destructive",
        className: "border-0",
        description: (
          <div className="flex items-center gap-2">
            <CircleAlert className="h-5 w-5" />
            <span>
              {error instanceof Error
                ? error.message
                : "An unknown error occurred"}
            </span>
          </div>
        ),
        duration: 2000,
      });
    }
  }

  // Calculate totals
  const subTotal = services.reduce(
    (total, service) =>
      total + (service.amount ?? 0) * Number(currency.toFixed(2)),
    0
  );

  const totalVat = Number.parseFloat(
    services
      .reduce(
        (total, service) =>
          total + Number(service.service_vat_amount.toFixed(2)),
        0
      )
      .toFixed(2)
  );

  const totalAmount = subTotal + totalVat;

  return (
    <div>
      <ServiceSheetModal />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <InvoiceDetailsSection form={form} />

          <ServiceSelection form={form} />

          <InvoiceSummarySection
            currencyId={currencyId}
            subTotal={subTotal}
            totalVat={totalVat}
            totalAmount={totalAmount}
          />

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              size="lg"
              className="px-6"
              disabled={
                form.formState.isSubmitting ||
                (action === "edit" && !form.formState.isDirty)
              }
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {action === "edit" ? "Update Invoice" : "Create Invoice"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
