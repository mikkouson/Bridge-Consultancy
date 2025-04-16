"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import type { UseFormReturn } from "react-hook-form";
import type { InvoicesSchemaType } from "@/app/types/invoices.type";
import { useCustomer } from "@/app/hooks/use-company";
import { usePaymentOptions } from "@/app/hooks/use-payment-options";
import {
  Building,
  CalendarIcon,
  CreditCard,
  FileText,
  Receipt,
} from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ComboboxForm } from "../popover";

interface InvoiceDetailsSectionProps {
  form: UseFormReturn<InvoicesSchemaType>;
}

export function InvoiceDetailsSection({ form }: InvoiceDetailsSectionProps) {
  const { data: company } = useCustomer();
  const { data: payment_option } = usePaymentOptions();

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

  const currencyId = form.watch("currency") || "AED";
  const payment = form.watch("payment_option");

  // Helper function to get currency symbol by ID
  const getCurrencySymbol = (currencyId: string): string => {
    return currencyData.find((c) => c.id === currencyId)?.symbol || "د.إ";
  };

  const findpayment = payment_option?.find(
    (p: { id: number }) => p?.id === payment
  )?.currency;

  // Update currency when payment option changes
  useEffect(() => {
    if (findpayment) {
      form.setValue("currency", findpayment, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [findpayment, form]);

  return (
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
                    type="text"
                    onChange={(e) => {
                      const cleanValue = e.target.value.replace(/\D/g, "");
                      const withoutLeadingZeros =
                        cleanValue.replace(/^0+/, "") || "";
                      field.onChange(
                        withoutLeadingZeros ? Number(withoutLeadingZeros) : ""
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
            render={({ field }) => (
              <FormItem className="md:col-span-1 lg: col-span-2">
                <FormLabel className="flex items-center gap-2">
                  <span>{getCurrencySymbol(currencyId)}</span>
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
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
