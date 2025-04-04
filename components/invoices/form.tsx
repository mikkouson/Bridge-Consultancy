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

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ComboboxForm } from "../popover";
import { useCompany } from "@/app/hooks/use-company";
import { usePaymentOptions } from "@/app/hooks/use-payment-options";
import ServiceSelection from "./service-selection";
import { useServices } from "@/app/hooks/use-services";
import { Checkbox } from "../ui/checkbox";
import { useVat } from "@/app/hooks/use-vat";
import { Separator } from "@radix-ui/react-separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

export function InvoicesForm({
  data = {},
  setOpen,
  action,
}: {
  data?: Partial<InvoicesSchemaType>;
  setOpen: (open: boolean) => void;
  action?: "create" | "edit";
}) {
  const { data: company } = useCompany();
  const { data: payment_option } = usePaymentOptions();
  const { data: vat } = useVat();

  const form = useForm<InvoicesSchemaType>({
    resolver: zodResolver(InvoicesSchema),
    defaultValues: {
      id: data?.id ?? 0,
      deleted_at: data?.deleted_at ?? null,
      company: data?.company ?? undefined,
      invoice_number: data?.invoice_number ?? "",
      date: data?.date ? new Date(data.date) : undefined,
      vat: data?.vat ?? 0,
      payment_option: data?.payment_option ?? undefined,
      services: data?.services
        ? [
            {
              invoice_service_id: data?.services.id ?? "",
              service_name: data?.services.name ?? "",
              amount: data?.services.amount ?? 0,
              invoice_id: data?.services.invoice_id ?? "",
            },
          ]
        : [], // Ensure that services is an array
    },
  });

  // const { isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof InvoicesSchema>) {
    try {
      // if (action === "edit") {
      //   await updateInvoice(data);
      // } else {
      //   await createInvoice(data);
      // }

      toast({
        title: "Success",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
      // setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }
  const servicesTotal = form
    .watch("services")
    .reduce((total, service) => total + (service.amount || 0), 0);

  // Get VAT rate from selected VAT
  const vatID = form.watch("vat");
  // const vatValue = vat?.find((vat) => vat.id === vatID);
  // const vatRate = vatValue ? vatValue.value : 0;

  // Calculate VAT amount
  // const vatAmount = (servicesTotal * vatRate) / 100;

  // Calculate total
  // const totalAmount = servicesTotal + vatAmount;

  return (
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  title="Company"
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
                  title="Payment Option"
                />
              </div>
            </div>
          </CardContent>

          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Services & Pricing
            </CardTitle>
            <CardDescription>
              Add services and calculate the invoice total
            </CardDescription>
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
                      Subtotal
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Amount"
                        {...field}
                        type="number"
                        value={servicesTotal.toFixed(2)}
                        readOnly
                        className="bg-muted"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="vat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VAT Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VAT Amount"
                        {...field}
                        type="number"
                        value={vatAmount.toFixed(2)}
                        readOnly
                        className="bg-muted"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 dark:bg-slate-900">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">Total Amount</div>
              <div className="text-2xl font-bold">
                {/* ${totalAmount.toFixed(2)} */}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button type="submit" size="lg" className="px-8">
                {action === "edit" ? "Update Invoice" : "Create Invoice"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
