"use client";

import { StatementEntryType } from "@/app/types/soa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";

interface SoaSummaryProps {
  openingBalance: number;
  statementEntries: Array<{
    entry_date: Date;
    transaction_type: "Invoice" | "Payment Received";
    reference: string;
    amount?: number;
    payment?: number;
    balance: number;
    currency: string;
    invoice_id?: number;
    payment_id?: number;
  }>;
  currency?: string;
  getCurrencySymbol?: (currencyCode: string) => string;
}

export function SoaSummary({
  openingBalance,
  statementEntries,
  currency = "AED",
  getCurrencySymbol,
}: SoaSummaryProps) {
  // Calculate totals from statement entries, grouped by currency
  const calculateTotals = () => {
    if (!statementEntries.length)
      return {
        totalInvoiced: 0,
        totalPaid: 0,
        currencyTotals: {},
      };

    const result = statementEntries.reduce(
      (
        acc: {
          totalInvoiced: number;
          totalPaid: number;
          currencyTotals: Record<string, { invoiced: number; paid: number }>;
        },
        entry
      ) => {
        // Initialize currency in accumulator if not exists
        if (!acc.currencyTotals[entry.currency]) {
          acc.currencyTotals[entry.currency] = { invoiced: 0, paid: 0 };
        }

        if (entry.transaction_type === "Invoice") {
          const amount = Number(entry.amount || 0);
          acc.totalInvoiced += amount;
          acc.currencyTotals[entry.currency].invoiced += amount;
        } else if (entry.transaction_type === "Payment Received") {
          const payment = Number(entry.payment || 0);
          acc.totalPaid += payment;
          acc.currencyTotals[entry.currency].paid += payment;
        }
        return acc;
      },
      { totalInvoiced: 0, totalPaid: 0, currencyTotals: {} }
    );

    return result;
  };

  // Use provided getCurrencySymbol function or fallback to local implementation
  const getSymbol =
    getCurrencySymbol ||
    ((currencyCode: string) => {
      const currencies = {
        AED: "د.إ",
        USD: "$",
        EUR: "€",
      };
      return (
        currencies[currencyCode as keyof typeof currencies] || currencyCode
      );
    });

  const currencySymbol = getSymbol(currency);
  const { totalInvoiced, totalPaid, currencyTotals } = calculateTotals();

  // Calculate current balance (invoice - payments)
  const currentBalance = totalInvoiced - totalPaid;

  // Calculate total dues (current balance + opening balance)
  const totalDues = currentBalance + openingBalance;

  // Determine if we have multiple currencies
  const hasMultipleCurrencies = Object.keys(currencyTotals).length > 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statement Summary</CardTitle>
        <CardDescription>
          Summary of transactions for this statement period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Opening Balance</p>
              <p className="text-lg font-medium">
                {currencySymbol} {openingBalance.toFixed(2)}
              </p>
            </div>

            {hasMultipleCurrencies ? (
              <div>
                <p className="text-sm text-muted-foreground">Total Invoiced</p>
                <div>
                  {Object.entries(currencyTotals).map(([curr, total]) => (
                    <p key={curr} className="text-lg font-medium">
                      {getSymbol(curr)} {total.invoiced.toFixed(2)}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground">Total Invoiced</p>
                <p className="text-lg font-medium">
                  {currencySymbol} {totalInvoiced.toFixed(2)}
                </p>
              </div>
            )}

            {hasMultipleCurrencies ? (
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <div>
                  {Object.entries(currencyTotals).map(([curr, total]) => (
                    <p key={curr} className="text-lg font-medium">
                      {getSymbol(curr)} {total.paid.toFixed(2)}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-lg font-medium">
                  {currencySymbol} {totalPaid.toFixed(2)}
                </p>
              </div>
            )}

            {hasMultipleCurrencies ? (
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <div>
                  {Object.entries(currencyTotals).map(([curr, total]) => (
                    <p key={curr} className="text-lg font-medium">
                      {getSymbol(curr)}{" "}
                      {(total.invoiced - total.paid).toFixed(2)}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-lg font-medium">
                  {currencySymbol} {currentBalance.toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Total Due Section */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-base font-semibold">Total Due:</p>
                <p className="text-sm text-muted-foreground">
                  As of {format(new Date(), "PPP")}
                </p>
              </div>
              {hasMultipleCurrencies ? (
                <div className="text-right">
                  {Object.entries(currencyTotals).map(([curr, total]) => {
                    const balance = total.invoiced - total.paid;
                    const totalDueForCurrency =
                      curr === currency ? balance + openingBalance : balance;
                    return (
                      <p
                        key={curr}
                        className={`text-xl font-bold ${
                          totalDueForCurrency > 0
                            ? "text-destructive"
                            : totalDueForCurrency < 0
                            ? "text-emerald-600"
                            : "text-primary"
                        }`}
                      >
                        {getSymbol(curr)} {totalDueForCurrency.toFixed(2)}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <div className="text-right">
                  <p
                    className={`text-xl font-bold ${
                      totalDues > 0
                        ? "text-destructive"
                        : totalDues < 0
                        ? "text-emerald-600"
                        : "text-primary"
                    }`}
                  >
                    {currencySymbol} {totalDues.toFixed(2)}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      totalDues > 0
                        ? "text-destructive"
                        : totalDues < 0
                        ? "text-emerald-600"
                        : "text-primary"
                    }`}
                  >
                    {totalDues > 0
                      ? "Payment required"
                      : totalDues < 0
                      ? "Credit balance"
                      : "Fully paid"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
