"use client";

import { createInvoice, updateInvoice } from "@/app/(admin)/invoices/actions";
import { InvoicesSchema, InvoicesSchemaType } from "@/app/types/invoices.type";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { format } from "date-fns";
import {
  Building,
  Calculator,
  CalendarIcon,
  CreditCard,
  DollarSign,
  FileText,
  Percent,
  Receipt,
} from "lucide-react";

import { useCompany } from "@/app/hooks/use-company";
import { usePaymentOptions } from "@/app/hooks/use-payment-options";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import { ComboboxForm } from "../popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ServiceSelection from "./service-selection";
import { ServiceSheetModal } from "../servicesheet";

// Define the interface for invoice service items
interface InvoiceService {
  id: number;
  amount: number;
  service_id: number;
  service_vat: boolean;
  service_date: string | Date | undefined;
  service_name: string;
  service_vat_amount: number;
  deleted_at?: Date | null;
}

// Extend the InvoicesSchemaType for the form data
interface InvoiceFormData extends Partial<InvoicesSchemaType> {
  invoice_services?: InvoiceService[];
}

export function InvoicesForm({
  data = {},
  action,
}: {
  data?: InvoiceFormData;
  action?: "create" | "edit";
}) {
  const { data: company } = useCompany();
  const { data: payment_option } = usePaymentOptions();

  const form = useForm<InvoicesSchemaType>({
    resolver: zodResolver(InvoicesSchema),
    defaultValues: {
      id: data?.id ?? 0,
      deleted_at: data?.deleted_at ?? null,
      company: data?.company ?? undefined,
      invoice_number: data?.invoice_number ?? "",
      date: data?.date ? new Date(data.date) : undefined,
      payment_option: data?.payment_option ?? undefined,
      amount: data?.amount ?? 0,
      total_vat_amount: data?.total_vat_amount ?? 0,
      total_amount: data?.total_amount ?? 0,
      // Map invoice_services to services if it exists
      services: data?.invoice_services?.length
        ? data.invoice_services.map((service: InvoiceService) => ({
            id: service.id,
            amount: service.amount,
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

  async function onSubmit(data: z.infer<typeof InvoicesSchema>) {
    try {
      if (action === "edit") {
        await updateInvoice(data);
      } else {
        await createInvoice(data);
      }

      toast({
        title: "Success",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }

  return (
    <div>
      <ServiceSheetModal />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Details
              </CardTitle>
              <CardDescription>
                Enter the basic information for this invoice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="invoice_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Receipt className="h-4 w-4" />
                        Invoice Number
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., INV-2023-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Invoice Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-1">
                  <FormLabel className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4" />
                    Client Information
                  </FormLabel>
                  <ComboboxForm
                    data={company}
                    form={form}
                    name="company"
                    formName="name"
                  />
                </div>

                <div className="md:col-span-1">
                  <FormLabel className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Details
                  </FormLabel>
                  <ComboboxForm
                    data={payment_option}
                    form={form}
                    name="payment_option"
                    formName="bank_name"
                  />
                </div>
              </div>
            </CardContent>

            <CardHeader className="py-2">
              <FormField
                control={form.control}
                name="services"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Services & Pricing
                    </FormLabel>
                    <CardDescription>
                      Add services and calculate the invoice total
                    </CardDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardHeader>

            <ServiceSelection form={form} />
          </Card>

          <Card>
            <CardContent>
              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Sub Total
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0.00"
                          {...field}
                          type="number"
                          readOnly
                          value={field?.value?.toFixed(2)}
                          className="font-semibold bg-accent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="total_vat_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        VAT Amount
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0.00"
                          {...field}
                          value={field?.value?.toFixed(2)}
                          type="number"
                          readOnly
                          className="font-semibold bg-accent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="total_amount"
                  render={({ field }) => {
                    const servicesSubTotal = form
                      .watch("services")
                      .reduce(
                        (total, service) => total + (service.amount || 0),
                        0
                      );

                    const servicesTotalVat = form
                      .watch("services")
                      .reduce(
                        (total, service) =>
                          total + (service.service_vat_amount || 0),
                        0
                      );

                    const totalAmount = servicesSubTotal + servicesTotalVat;

                    return (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Total Amount
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Total Amount"
                            {...field}
                            type="number"
                            value={totalAmount.toFixed(2)} // Corrected dynamic total
                            className="bg-muted"
                            readOnly
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-50 dark:bg-slate-900">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Total Amount Due
                </div>
                <FormField
                  control={form.control}
                  name="total_amount"
                  render={() => {
                    const servicesSubTotal = form
                      .watch("services")
                      .reduce(
                        (total, service) => total + (service.amount || 0),
                        0
                      );

                    const servicesTotalVat = form
                      .watch("services")
                      .reduce(
                        (total, service) =>
                          total + (service.service_vat_amount || 0),
                        0
                      );

                    const totalAmount = servicesSubTotal + servicesTotalVat;

                    return (
                      <FormItem>
                        <FormControl>
                          <span>
                            <div className="text-2xl font-bold">
                              {totalAmount.toFixed(2)}
                            </div>
                          </span>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="px-6"
                  disabled={action === "edit" && !form.formState.isDirty}
                >
                  {action === "edit" ? "Update Invoice" : "Create Invoice"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
