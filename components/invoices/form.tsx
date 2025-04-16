"use client";

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
  CheckCircle,
  CircleAlert,
  CreditCard,
  FileText,
  Loader2,
  Percent,
  Receipt,
} from "lucide-react";

import { createInvoice, updateInvoice } from "@/app/(admin)/invoices/actions";
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
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import { ComboboxForm } from "../popover";
import { ServiceSheetModal } from "../servicesheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ServiceSelection from "./service-selection";

// Define the interface for invoice service items

export function InvoicesForm({
  data,
  action,
}: {
  data?: InvoicesSchemaType;
  action?: "create" | "edit";
}) {
  const { data: curr, mutate } = useSWR(
    "https://api.fxratesapi.com/latest?currencies=USD,EUR&base=AED&api_key=fxr_live_8e199f68b4848badf957957345368a4b4e12",
    (url) => fetch(url).then((res) => res.json())
  );

  const { data: company } = useCompany();
  const { data: payment_option } = usePaymentOptions();
  const router = useRouter();
  const currencyData = [
    { id: "AED", currency: "UAE Dirham (AED)", symbol: "د.إ" },
    { id: "USD", currency: "US Dollar (USD)", symbol: "$" },
    { id: "EUR", currency: "Euro (EUR)", symbol: "€" },
  ];

  const invoice_type = [
    { id: "INVOICE", name: "INVOICE" },
    { id: "TAX INVOICE", name: "TAX INVOICE" },
    { id: "PROFORMA INVOICE", name: "PROFORMA INVOICE" },
  ];

  const form = useForm<InvoicesSchemaType>({
    resolver: zodResolver(InvoicesSchema),
    defaultValues: {
      id: data?.id ?? 0,
      deleted_at: data?.deleted_at ?? null,
      company: data?.company ?? undefined,
      invoice_number: data?.invoice_number ?? "",
      date: data?.date ? new Date(data.date) : undefined,
      payment_option: data?.payment_option ?? undefined,
      exchange_rate: data?.exchange_rate ?? 1, // Set default value for exchange_rate if needed
      subject: data?.subject ?? "",
      invoice_type: data?.invoice_type ?? "",
      trn: data?.trn ?? 0,
      currency: data?.currency ?? "AED",

      // Map invoice_services to services if it exists
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

  const currencyId = form.watch("currency") || "AED"; // Watch the selected currency ID
  const payment = form.watch("payment_option");
  const currency = form.watch("exchange_rate");
  const services = form.getValues().services || [];
  // Helper function to get currency symbol by ID
  const getCurrencySymbol = (currencyId: string): string => {
    return currencyData.find((c) => c.id === currencyId)?.symbol || "د.إ";
  };

  const findpayment = payment_option?.find(
    (p: { id: number }) => p?.id === payment
  )?.currency;

  useEffect(() => {
    if (findpayment) {
      form.setValue("currency", findpayment, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [findpayment, form]);

  // Separate effect to handle exchange rate calculations
  useEffect(() => {
    if (currencyId && curr?.rates) {
      // Get conversion rate based on selected currency
      const newRate = curr.rates[currencyId] ?? 1;
      form.setValue("exchange_rate", Number(newRate));

      // Only update if the rate has actually changed to prevent loops
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
        className: " border-0",
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 " />
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

  const subTotal = services.reduce(
    (total, service) =>
      total + (service.amount ?? 0) * Number(currency.toFixed(2)),
    0
  );
  const totalVat = parseFloat(
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="md:col-span-1 lg: col-span-2">
                  <FormLabel className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4" />
                    Invoice Type
                  </FormLabel>
                  <ComboboxForm
                    data={invoice_type}
                    form={form}
                    name="invoice_type"
                    formName="name"
                  />
                </div>
                <FormField
                  control={form.control}
                  name="trn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TRN </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="TRN"
                          {...field}
                          type="text" // Changed from "number" to "text"
                          onChange={(e) => {
                            // Remove any non-digit characters
                            const cleanValue = e.target.value.replace(
                              /\D/g,
                              ""
                            );
                            // Remove leading zeros
                            const withoutLeadingZeros =
                              cleanValue.replace(/^0+/, "") || "";
                            // Update the form value as a number (or empty string)
                            field.onChange(
                              withoutLeadingZeros
                                ? Number(withoutLeadingZeros)
                                : ""
                            );
                          }}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="invoice_number"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1 lg: col-span-2">
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
                  name="subject"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1 lg: col-span-2">
                      <FormLabel className="flex items-center gap-2">
                        <Receipt className="h-4 w-4" />
                        Subject
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col md:col-span-1 lg: col-span-2">
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

                <div className="md:col-span-1 lg: col-span-2">
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

                <div className="md:col-span-1 lg: col-span-2">
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
                <div className="md:col-span-1 lg: col-span-2 pointer-events-none opacity-50">
                  <FormLabel className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4" />
                    Currency
                  </FormLabel>
                  <ComboboxForm
                    data={currencyData}
                    form={form}
                    name="currency"
                    formName="currency"
                  />
                </div>

                <FormField
                  control={form.control}
                  name="exchange_rate"
                  render={({ field }) => {
                    return (
                      <FormItem className="md:col-span-1 lg: col-span-2">
                        <FormLabel className="flex items-center gap-2">
                          <span> {getCurrencySymbol(currencyId)}</span>
                          Exchange Rate
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="relative">
                              <Input
                                className="peer pe-12 ps-6 bg-muted"
                                placeholder="0.00"
                                {...field}
                                type="number"
                                readOnly
                                value={field?.value?.toFixed(2)}
                              />
                              <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-sm text-muted-foreground peer-disabled:opacity-50">
                                {getCurrencySymbol(currencyId)}
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                                {currencyId}
                              </span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </CardContent>

            <CardHeader className="py-2">
              <FormField
                control={form.control}
                name="services"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <span className="text-lg font-semibold">
                        {" "}
                        {getCurrencySymbol(currencyId)}
                      </span>
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
                {/* Subtotal */}
                <div className="space-y-2">
                  <FormLabel className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Sub Total
                  </FormLabel>
                  <div className="relative">
                    <Input
                      className="peer pe-12 ps-6 bg-muted"
                      placeholder="0.00"
                      type="number"
                      readOnly
                      value={subTotal.toFixed(2)}
                    />
                    <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-sm text-muted-foreground peer-disabled:opacity-50">
                      {getCurrencySymbol(currencyId)}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                      {currencyId}
                    </span>
                  </div>
                </div>
                {/* Total Vat */}
                <div className="space-y-2">
                  <FormLabel className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    VAT Amount
                  </FormLabel>
                  <div className="relative">
                    <Input
                      className="peer pe-12 ps-6 bg-muted"
                      placeholder="0.00"
                      type="number"
                      readOnly
                      value={totalVat.toFixed(2)}
                    />
                    <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-sm text-muted-foreground peer-disabled:opacity-50">
                      {getCurrencySymbol(currencyId)}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                      {currencyId}
                    </span>
                  </div>
                </div>
                {/* Total Amount */}
                <div className="space-y-2">
                  <FormLabel className="flex items-center gap-2">
                    <span> {getCurrencySymbol(currencyId)}</span>
                    Total Amount
                  </FormLabel>
                  <div className="relative">
                    <Input
                      className="peer pe-12 ps-6 bg-muted"
                      placeholder="0.00"
                      type="number"
                      readOnly
                      value={totalAmount.toFixed(2)}
                    />
                    <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-sm text-muted-foreground peer-disabled:opacity-50">
                      {getCurrencySymbol(currencyId)}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                      {currencyId}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold flex items-center gap-2">
                  <span> {getCurrencySymbol(currencyId)}</span>
                  Total Amount Due
                </div>

                <div className="text-2xl font-bold">
                  {totalAmount.toFixed(2)}
                </div>
              </div>

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
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
