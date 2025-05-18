"use client";

import moment from "moment";
import type { InvoicesSchemaType } from "@/app/types/invoices.type";
import type { SoaSchemaType, StatementEntryType } from "@/app/types/soa";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";
import type { DateRange } from "react-day-picker";
import type { UseFormReturn } from "react-hook-form";
import { DatePickerWithRange } from "../date-range-picker";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
const InvoiceSheet = ({
  form,
  invoiceData,
  data,
}: {
  form: UseFormReturn<SoaSchemaType>;
  data?: Partial<SoaSchemaType>;
  invoiceData?: InvoicesSchemaType[];
}) => {
  const [open, setOpen] = useState(false);

  const [filters, setFilters] = React.useState({
    search: "",
    dateRange: undefined as DateRange | undefined,
  });
  const statementEntries = form.watch("statement_entries") || [];
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
      date: moment(invoice.date).toDate(),
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
          const dateA = moment(a.date).valueOf();
          const dateB = moment(b.date).valueOf();
          return dateA - dateB;
        });

        paymentEntries = sortedPayments.map((payment) => {
          const paymentAmount = Number(payment.amount) || 0;
          runningBalance -= paymentAmount;

          return {
            date: moment(payment.date).toDate(),
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

    return invoiceData?.filter((invoice: InvoicesSchemaType) => {
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
        const invoiceDate = moment(invoice.date);
        dateMatch =
          invoiceDate.isSameOrAfter(moment(filters.dateRange.from)) &&
          invoiceDate.isSameOrBefore(moment(filters.dateRange.to));
      }

      return searchMatch && dateMatch;
    });
  }, [invoiceData, filters]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Display selected invoices */}
      {statementEntries.length > 0 && (
        <div className="mb-4 space-y-2">
          <h3 className="text-sm font-medium">Selected Invoices:</h3>
          <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-2">
            {/* Group entries by invoice_id to show each invoice only once */}
            {Array.from(
              new Set(statementEntries.map((entry) => entry.invoice_id))
            ).map((invoiceId) => {
              const invoiceEntry = statementEntries.find(
                (entry) =>
                  entry.invoice_id === invoiceId &&
                  entry.transaction_type === "Invoice"
              );
              if (!invoiceEntry) return null;

              return (
                <div
                  key={invoiceId}
                  className="flex justify-between items-center p-2 bg-muted/30 rounded"
                >
                  <div>
                    <p className="font-medium">{invoiceEntry.reference}</p>
                    <p className="text-xs text-muted-foreground">
                      {moment(invoiceEntry.date).format("LL")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p>
                      {getCurrencySymbol(invoiceEntry.currency ?? "AED")}
                      {invoiceEntry.amount?.toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() =>
                        invoiceId && removeFromStatement(invoiceId)
                      }
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full border border-dashed border-gray-500"
        >
          <Plus /> Add Invoice
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md overflow-auto">
        <SheetHeader>
          <SheetTitle>Select Invoices</SheetTitle>
          <SheetDescription>
            Choose from the available invoices below.
          </SheetDescription>
        </SheetHeader>
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
                            <p className="font-medium">{inv.invoice_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {moment(inv.date).format("LL")}
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
        <SheetFooter>
          {/* <Button onClick={() => setOpen(false)}>Done</Button> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default InvoiceSheet;
