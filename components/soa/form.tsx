"use client";

import { useInvoice } from "@/app/hooks/use-invoices";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, CircleAlert, Search } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "../date-range-picker";
import { SoaSummary } from "./summary";
import { EntriesTable } from "./entries-table";
import { CreateSOA } from "@/app/(admin)/soa/actions";

export function SoaForm({
  data = {},
  id,
  action,
  invoice,
}: {
  id?: string;
  data?: Partial<SoaSchemaType>;
  action?: "create" | "edit";
  invoice?: Partial<InvoicesSchemaType>;
}) {
  const { data: invoiceData } = useInvoice();
  const [filters, setFilters] = React.useState({
    search: "",
    dateRange: undefined as DateRange | undefined,
  });

  const form = useForm({
    resolver: zodResolver(SoaSchema),
    defaultValues: {
      id: data?.id ?? 0,
      company_id: Number(id),
      statement_date: data?.statement_date,
      opening_balance_date: data?.opening_balance_date || new Date(),
      opening_balance: data?.opening_balance ?? 0,
      statement_number: data?.statement_number ?? "",
      statement_entries: data?.statement_entries ?? [],
      currency: data?.currency ?? "AED",
    },
  });
  const { isSubmitting } = form.formState;

  // Watch the opening balance date and statement entries
  const statementEntries = form.watch("statement_entries") || [];

  // Calculate totals from statement entries
  const calculateTotals = () => {
    if (!statementEntries.length) return { totalInvoiced: 0, totalPaid: 0 };

    return statementEntries.reduce(
      (acc: { totalInvoiced: number; totalPaid: number }, entry) => {
        if (entry.transaction_type === "Invoice") {
          acc.totalInvoiced += Number(entry.amount || 0);
        } else if (entry.transaction_type === "Payment Received") {
          acc.totalPaid += Number(entry.payment || 0);
        }
        return acc;
      },
      { totalInvoiced: 0, totalPaid: 0 }
    );
  };

  const { totalInvoiced, totalPaid } = calculateTotals();
  const openingBalance = form.watch("opening_balance") || 0;
  const balance = openingBalance + totalInvoiced - totalPaid;

  // Get currency symbol based on currency code
  const getCurrencySymbol = (currencyCode: string) => {
    const currencies = {
      AED: "د.إ",
      USD: "$",
      EUR: "€",
    };
    return currencies[currencyCode as keyof typeof currencies] || currencyCode;
  };

  const addToStatement = (invoice: InvoicesSchemaType) => {
    const currentEntries = form.getValues("statement_entries") || [];
    // Add invoice entry
    const invoiceEntry: StatementEntryType = {
      entry_date: new Date(invoice.date),
      transaction_type: "Invoice",
      reference: `Invoice ${invoice.invoice_number}`,
      amount: invoice.total_amount || 0,
      payment: 0,
      balance: invoice.total_amount || 0,
      currency: invoice.currency || "AED",
      invoice_id: invoice.id,
    };

    // Process payments if they exist
    let paymentEntries: StatementEntryType[] = [];
    let runningBalance = invoice.total_amount || 0;

    // Ensure payments exists, is an array and has items
    if (
      "payments" in invoice &&
      Array.isArray(invoice.payments) &&
      invoice.payments.length > 0
    ) {
      try {
        // Create a safe copy of the payments array
        const safePayments = [...invoice.payments].filter(
          (payment) =>
            payment &&
            typeof payment === "object" &&
            "amount" in payment &&
            payment.amount
        );

        // Sort payments by date
        const sortedPayments = safePayments.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateA - dateB;
        });

        paymentEntries = sortedPayments.map((payment) => {
          const paymentAmount = Number(payment.amount) || 0;
          runningBalance -= paymentAmount;

          return {
            entry_date: new Date(payment.date),
            transaction_type: "Payment Received" as const,
            reference: `Payment `,
            amount: 0,
            payment: paymentAmount,
            balance: runningBalance,
            currency: invoice.currency || "AED",
            invoice_id: invoice.id,
            payment_id: payment.id,
          };
        });
      } catch (error) {
        console.error("Error processing payments:", error);
      }
    }

    // Check if invoice is already in entries
    if (!currentEntries.some((e) => e.invoice_id === invoice.id)) {
      const newEntries = [...currentEntries, invoiceEntry, ...paymentEntries];

      form.setValue("statement_entries", newEntries, {
        shouldValidate: true,
      });

      // Update main form currency if all entries share the same currency
      if (newEntries.length > 0) {
        const firstEntryCurrency = newEntries[0].currency;
        if (firstEntryCurrency) {
          const allSameCurrency = newEntries.every(
            (entry) => entry.currency === firstEntryCurrency
          );
          if (
            allSameCurrency &&
            form.getValues("currency") !== firstEntryCurrency
          ) {
            form.setValue("currency", firstEntryCurrency, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }
        }
      }
    }

    // Log the final statement entries for debugging
    console.log(
      "Final statement entries:",
      form.getValues("statement_entries")
    );
  };

  const removeFromStatement = (invoiceId: number) => {
    const currentEntries = form.getValues("statement_entries") || [];
    const updatedEntries = currentEntries.filter(
      (e) => e.invoice_id !== invoiceId
    );
    form.setValue("statement_entries", updatedEntries);

    // Update main form currency
    if (updatedEntries.length > 0) {
      const firstEntryCurrency = updatedEntries[0].currency;
      if (firstEntryCurrency) {
        const allSameCurrency = updatedEntries.every(
          (entry) => entry.currency === firstEntryCurrency
        );
        if (
          allSameCurrency &&
          form.getValues("currency") !== firstEntryCurrency
        ) {
          form.setValue("currency", firstEntryCurrency, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
        // If currencies become mixed after removal, the main currency remains as it was.
        // Or, if you prefer to reset or set a specific currency for mixed cases, add logic here.
      }
    } else {
      // No entries left, reset to default
      const defaultCurrency = data?.currency ?? "AED";
      if (form.getValues("currency") !== defaultCurrency) {
        form.setValue("currency", defaultCurrency, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  };

  const filteredInvoices = React.useMemo(() => {
    if (!invoiceData) return [];

    return invoiceData.filter((invoice: InvoicesSchemaType) => {
      // Filter by search term
      const searchMatch =
        !filters.search ||
        invoice.invoice_number
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        invoice.subject?.toLowerCase().includes(filters.search.toLowerCase());

      // Filter by date range if selected
      let dateMatch = true;
      if (filters.dateRange?.from && filters.dateRange?.to) {
        const invoiceDate = new Date(invoice.date);
        dateMatch =
          invoiceDate >= filters.dateRange.from &&
          invoiceDate <= filters.dateRange.to;
      }

      return searchMatch && dateMatch;
    });
  }, [invoiceData, filters]);

  async function onSubmit(values: any) {
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
      } else {
        await CreateSOA(updatedValues);
      }

      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(updatedValues, null, 2)}
            </code>
          </pre>
        ),
      });
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
          {/* Display filtered invoices with checkboxes */}
          <FormField
            control={form.control}
            name="statement_entries"
            render={() => (
              <FormItem>
                <FormLabel>Available Invoices</FormLabel>

                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search invoices..."
                      className="pl-8"
                      value={filters.search}
                      onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <DatePickerWithRange
                      date={filters.dateRange}
                      onDateChange={(range) =>
                        setFilters({ ...filters, dateRange: range })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {filteredInvoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
                      <p className="text-muted-foreground">No invoices found</p>
                    </div>
                  ) : (
                    filteredInvoices.map((inv: InvoicesSchemaType) => (
                      <div key={inv.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={statementEntries.some(
                                (e) => e.invoice_id === inv.id
                              )}
                              onCheckedChange={() => {
                                if (
                                  statementEntries.some(
                                    (e) => e.invoice_id === inv.id
                                  )
                                ) {
                                  removeFromStatement(inv.id!);
                                } else {
                                  addToStatement(inv);
                                }
                              }}
                            />
                            <div>
                              <p className="font-medium">
                                {inv.invoice_number}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(inv.date), "PPP")}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {getCurrencySymbol(inv.currency)}{" "}
                              {inv.total_amount?.toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Paid: {getCurrencySymbol(inv.currency)}{" "}
                              {inv.paid?.toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Balance: {getCurrencySymbol(inv.currency)}{" "}
                              {inv.balance?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

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
          currency={form.watch("currency")}
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
          currency={form.watch("currency")}
          getCurrencySymbol={getCurrencySymbol}
        />
      </div>
    </div>
  );
}
