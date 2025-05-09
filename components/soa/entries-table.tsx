"use client";

import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatementEntry {
  entry_date: Date;
  transaction_type: "Invoice" | "Payment Received";
  reference: string;
  amount?: number;
  payment?: number;
  balance: number;
  currency: string;
  invoice_id?: number;
  payment_id?: number;
}

interface EntriesTableProps {
  entries: StatementEntry[];
  currency?: string;
  getCurrencySymbol?: (currencyCode: string) => string;
}

export function EntriesTable({
  entries,
  currency = "AED",
  getCurrencySymbol,
}: EntriesTableProps) {
  // Sort entries by date
  const sortedEntries = [...entries].sort(
    (a, b) =>
      new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()
  );

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statement Entries</CardTitle>
        <CardDescription>Detailed list of all transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Invoice</TableHead>
              <TableHead className="text-right">Payment</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No statement entries found
                </TableCell>
              </TableRow>
            ) : (
              sortedEntries.map((entry, index) => (
                <TableRow
                  key={`${entry.transaction_type}-${
                    entry.invoice_id || entry.payment_id || ""
                  }-${index}`}
                >
                  <TableCell>
                    {format(new Date(entry.entry_date), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{entry.reference}</TableCell>
                  <TableCell className="text-right">
                    {entry.amount && entry.amount > 0
                      ? `${getSymbol(entry.currency)} ${entry.amount.toFixed(
                          2
                        )}`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.payment && entry.payment > 0
                      ? `${getSymbol(entry.currency)} ${entry.payment.toFixed(
                          2
                        )}`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {`${getSymbol(entry.currency)} ${entry.balance.toFixed(2)}`}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
