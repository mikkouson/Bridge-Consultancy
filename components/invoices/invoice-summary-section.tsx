"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { Calculator, Percent } from "lucide-react";

interface InvoiceSummarySectionProps {
  currencyId: string;
  subTotal: number;
  totalVat: number;
  totalAmount: number;
}

export function InvoiceSummarySection({
  currencyId,
  subTotal,
  totalVat,
  totalAmount,
}: InvoiceSummarySectionProps) {
  // Helper function to get currency symbol
  const getCurrencySymbol = (currencyId: string): string => {
    const currencyData = [
      { id: "AED", currency: "UAE Dirham (AED)", symbol: "د.إ" },
      { id: "USD", currency: "US Dollar (USD)", symbol: "$" },
      { id: "EUR", currency: "Euro (EUR)", symbol: "€" },
    ];
    return currencyData.find((c) => c.id === currencyId)?.symbol || "د.إ";
  };

  return (
    <>
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
                <span>{getCurrencySymbol(currencyId)}</span>
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
              <span>{getCurrencySymbol(currencyId)}</span>
              Total Amount Due
            </div>

            <div className="text-2xl font-bold">{totalAmount.toFixed(2)}</div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
