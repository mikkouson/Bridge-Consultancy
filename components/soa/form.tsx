"use client";

import { createSOA } from "@/app/(admin)/soa/actions";
import { InvoicesSchemaType } from "@/app/types/invoices.type";
import { SoaSchema, SoaSchemaType, StatementEntryType } from "@/app/types/soa";
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
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  CheckCircle,
  CircleAlert,
  CreditCard,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { EntriesTable } from "./entries-table";
import InvoiceSheet from "./invoice-sheet";
import { SoaSummary } from "./summary";
import { ComboboxForm } from "../popover";
import { usePaymentOptions } from "@/app/hooks/use-payment-options";
import { PaymentOptionsSelect } from "../invoices/payment-options";

export function SoaForm({
  data = {},
  id,
  action,
  invoiceData = [],
}: {
  id?: string;
  data?: Partial<SoaSchemaType>;
  action?: "create" | "edit";
  invoiceData?: InvoicesSchemaType[];
}) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(SoaSchema),
    defaultValues: {
      id: data?.id ?? 0,
      company: Number(id) || Number(data.company_id) || 0,

      statement_date: data?.statement_date,
      opening_balance_date: data?.opening_balance_date || new Date(),
      opening_balance: data?.opening_balance ?? 0,
      statement_number: data?.statement_number ?? "",
      statement_entries: data?.statement_entries ?? [],
      currency: (data?.currency || "AED") as string,
      payment_option: data?.payment_option,
    },
  });
  const { isSubmitting } = form.formState;

  // Watch the opening balance date and statement entries
  const statementEntries = form.watch("statement_entries") || [];

  const openingBalance = form.watch("opening_balance") || 0;

  // Get currency symbol based on currency code
  const getCurrencySymbol = (currencyCode: string) => {
    const currencies = {
      AED: "د.إ",
      USD: "$",
      EUR: "€",
    };
    return currencies[currencyCode as keyof typeof currencies] || currencyCode;
  };
  const { data: payment_option } = usePaymentOptions();

  async function onSubmit(values: SoaSchemaType) {
    try {
      // Validate that we have at least one statement entry before submitting
      if (!values.statement_entries || values.statement_entries.length === 0) {
        toast({
          variant: "destructive",
          className: "border-0",
          description: (
            <div className="flex items-center gap-2">
              <CircleAlert className="h-5 w-5" />
              <span>Please add at least one invoice to the statement</span>
            </div>
          ),
          duration: 2000,
        });
        return;
      }

      // Ensure each entry has the correct currency before submitting
      const entriesWithCorrectCurrency = values.statement_entries.map(
        (entry: StatementEntryType) => {
          // Find the corresponding invoice to get its currency
          const invoice = invoiceData?.find(
            (inv: InvoicesSchemaType) => inv.id === entry.invoice_id
          );
          return {
            ...entry,
            currency: invoice?.currency || entry.currency || "AED",
          };
        }
      );

      // Update the values with the corrected entries
      const updatedValues = {
        ...values,
        statement_entries: entriesWithCorrectCurrency,
      };

      if (action === "edit") {
        // await updatePayment(updatedValues);
        // await updateSOA(updatedValues);
      } else {
        await createSOA(updatedValues);
      }

      toast({
        variant: "success",
        className: "border-0",
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span>Customer created successfully!</span>
          </div>
        ),
        duration: 2000,
      });
      router.push("/soa");
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* {JSON.stringify(data[0], null, 2)} */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="statement_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Statement Date <span className="text-red-500 text-lg">*</span>
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
                  <PopoverContent className="w-auto p-0" align="start">
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

          <FormField
            control={form.control}
            name="statement_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statement Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter statement number"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="opening_balance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opening Balance</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter opening balance"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="opening_balance_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Opening Balance Date{" "}
                  <span className="text-red-500 text-lg">*</span>
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
                  <PopoverContent className="w-auto p-0" align="start">
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
              <CreditCard className="h-4 w-4" />
              Payment Details
            </FormLabel>

            <PaymentOptionsSelect
              data={payment_option}
              form={form}
              name="payment_option.id"
            />
          </div>

          <InvoiceSheet form={form} invoiceData={invoiceData} data={data} />
          <Button type="submit" className="w-full">
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>

      {/* Add the Summary Component in the second column */}
      <div className="flex flex-col gap-4">
        <SoaSummary
          openingBalance={Number(openingBalance)}
          statementEntries={statementEntries.map((entry) => {
            // Find the corresponding invoice to get its currency
            const invoice = invoiceData?.find(
              (inv: InvoicesSchemaType) => inv.id === entry.invoice_id
            );
            return {
              ...entry,
              currency: invoice?.currency || entry.currency || "AED",
            };
          })}
          currency={form.watch("currency") ?? ""}
          getCurrencySymbol={getCurrencySymbol}
        />

        <EntriesTable
          entries={statementEntries.map((entry) => {
            // Find the corresponding invoice to get its currency
            const invoice = invoiceData?.find(
              (inv: InvoicesSchemaType) => inv.id === entry.invoice_id
            );
            return {
              ...entry,
              currency: invoice?.currency || entry.currency || "AED",
            };
          })}
          currency={form.watch("currency") ?? ""}
          getCurrencySymbol={getCurrencySymbol}
        />
      </div>
    </div>
  );
}
