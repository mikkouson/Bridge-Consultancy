import { StatementEntryType } from "@/app/types/soa";
import { InvoicesSchemaType } from "@/app/types/invoices.type";
import { SoaSummary } from "./summary";
import { EntriesTable } from "./entries-table";

interface SoaSummarySectionProps {
  openingBalance: number;
  statementEntries: StatementEntryType[];
  currency: string;
  getCurrencySymbol: (currencyCode: string) => string;
  invoiceData?: InvoicesSchemaType[];
  data: any;
}

export function SoaSummarySection({
  openingBalance,
  statementEntries,
  currency,
  getCurrencySymbol,
  invoiceData,
  data,
}: SoaSummarySectionProps) {
  // Ensure all required fields are present with default values
  const processedEntries = statementEntries.map((entry) => {
    const invoice = invoiceData?.find((inv) => inv.id === entry.invoice_id);
    return {
      ...entry,
      amount: entry.amount ?? 0,
      payment: entry.payment ?? 0,
      currency: invoice?.currency || entry.currency || "AED",
    };
  });

  return (
    <div className="flex flex-col gap-4">
      {JSON.stringify(data[0], null, 2)}
      <SoaSummary
        openingBalance={Number(openingBalance)}
        statementEntries={processedEntries}
        currency={currency}
        getCurrencySymbol={getCurrencySymbol}
      />

      <EntriesTable
        entries={processedEntries}
        currency={currency}
        getCurrencySymbol={getCurrencySymbol}
      />
    </div>
  );
}
