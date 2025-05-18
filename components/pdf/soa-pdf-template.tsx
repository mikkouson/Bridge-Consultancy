"use client";
import { SoaSchemaType, StatementEntryType } from "@/app/types/soa";
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import moment from "moment";
Font.register({
  family: "Courier Prime",
  fonts: [
    {
      src: "/fonts/CourierPrime-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "/fonts/CourierPrime-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});
const formatIBAN = (iban: string) => {
  if (!iban) return "";
  const part1 = iban.slice(0, 3); // AE5
  const part2 = iban.slice(3, 7); // 1086
  const part3 = iban.slice(7); // 000000932336900
  return `${part1} ${part2} ${part3}`;
};

// Define interfaces for type safety

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: "10mm",
    paddingTop: "0",
    paddingBottom: "5mm",
    fontFamily: "Courier Prime",
    fontSize: 11,
    color: "#333333",
    lineHeight: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logo: {
    marginTop: 20,
    width: 170,
    height: 100,
    objectFit: "fill",
  },
  title: {
    fontSize: 24,
    fontWeight: "semibold",
    marginTop: 20,
    textAlign: "right",
  },
  title2: {
    marginTop: 70,
    textAlign: "right",
  },
  companyName: {
    fontSize: 14,
    fontWeight: "semibold",
    marginBottom: 10,
  },

  companyDetail: {
    fontSize: 10,
    marginBottom: 2,
  },
  companyDetailTitle: {
    fontSize: 10,
    marginBottom: 2,
    fontWeight: "bold",
  },
  statementInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statementLabel: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right",
    width: 120,
  },
  statementValue: {
    fontSize: 10,
    textAlign: "right",
    width: 80,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bdbdbd",
    marginTop: 10,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#bdbdbd",
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: "bold",
    padding: 5,
  },
  tableCell: {
    fontSize: 9,
    padding: 5,
  },
  highlightedRow: {
    backgroundColor: "#e0f7fa",
  },
  dateColumn: {
    width: "15%",
    borderRightWidth: 1,
    borderRightColor: "#bdbdbd",
  },
  transactionColumn: {
    width: "20%",
    borderRightWidth: 1,
    borderRightColor: "#bdbdbd",
  },
  detailsColumn: {
    width: "20%",
    borderRightWidth: 1,
    borderRightColor: "#bdbdbd",
  },
  amountColumn: {
    width: "15%",
    borderRightWidth: 1,
    borderRightColor: "#bdbdbd",
    textAlign: "right",
  },
  paymentsColumn: {
    width: "15%",
    borderRightWidth: 1,
    borderRightColor: "#bdbdbd",
    textAlign: "right",
  },
  balanceColumn: {
    width: "15%",
    textAlign: "right",
  },
  paymentInstructions: {
    marginBottom: 20,
  },
  instructionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 5,
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 3,
  },
  instructionNumber: {
    fontSize: 9,
    width: 15,
    height: 15,
    backgroundColor: "#e0f7fa",
    textAlign: "center",
    marginRight: 5,
  },
  instructionText: {
    fontSize: 9,
  },
  row: {
    flexDirection: "row",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontWeight: "bold",
  },
  footerLogo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 8,
    color: "#9e9e9e",
    textAlign: "center",
  },
  paymentSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  paymentTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  paymentInfo: {
    fontSize: 9,
  },
  highlight: {
    color: "#651f65",
  },
});

interface InvoiceGroup {
  invoice: StatementEntryType;
  payments: StatementEntryType[];
}

export function StatementDocument({
  statementData,
}: {
  statementData: SoaSchemaType;
}) {
  // Filter out entries with deleted_at not null
  const activeEntries =
    statementData?.statement_entries?.filter(
      (entry) => entry.deleted_at === null
    ) || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo and Title */}
        <View style={styles.header}>
          <Image src="/bridge.jpg" style={styles.logo} />
          <View>
            <Text style={styles.title}>STATEMENT OF ACCOUNTS</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 70,
              }}
            >
              <View></View>
              <View>
                <View style={{ flexDirection: "row", marginBottom: 5 }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "demibold",
                      width: 100,
                      textAlign: "right",
                    }}
                  >
                    Statement No:
                  </Text>
                  <Text style={{ fontSize: 10, width: 80, textAlign: "right" }}>
                    {statementData.statement_number}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", marginBottom: 5 }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "demibold",
                      width: 100,
                      textAlign: "right",
                    }}
                  >
                    Statement Date:
                  </Text>
                  <Text style={{ fontSize: 10, width: 80, textAlign: "right" }}>
                    {moment(statementData.statement_date).format(
                      "MMMM D, YYYY"
                    )}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Company and Statement Info */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          {/* Left Column - Company Info */}
          <View>
            {statementData.company_id?.company_name && (
              <Text style={styles.companyName}>
                {statementData.company_id?.company_name}
              </Text>
            )}

            <Text style={styles.companyName}>
              {statementData.company_id?.name}
            </Text>
            {statementData.company_id?.contact && (
              <View style={{ flexDirection: "row", marginBottom: 5 }}>
                <Text style={styles.companyDetailTitle}>Phone: </Text>
                <Text style={styles.companyDetail}>
                  {statementData.company_id?.contact}
                </Text>
              </View>
            )}

            <View style={{ flexDirection: "row", marginBottom: 5 }}>
              <Text style={styles.companyDetailTitle}>Email: </Text>
              <Text style={styles.companyDetail}>
                {statementData.company_id?.email}
              </Text>
            </View>
          </View>

          {/* Right Column - Statement Info */}
          <View>
            <View style={{ flexDirection: "row", marginBottom: 5 }}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "semibold",
                  width: 100,
                  textAlign: "right",
                }}
              >
                Opening Balance:
              </Text>
              <Text style={{ fontSize: 10, width: 80, textAlign: "right" }}>
                {statementData.currency}{" "}
                {statementData.opening_balance.toFixed(2)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 5 }}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "bold",
                  width: 100,
                  textAlign: "right",
                }}
              >
                Invoiced Amount:
              </Text>
              <Text style={{ fontSize: 10, width: 80, textAlign: "right" }}>
                {statementData.currency}{" "}
                {(statementData?.total_paid ?? 0).toFixed(2)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 5 }}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "bold",
                  width: 100,
                  textAlign: "right",
                }}
              >
                Amount Paid:
              </Text>
              <Text style={{ fontSize: 10, width: 80, textAlign: "right" }}>
                {statementData.currency}{" "}
                {(statementData?.total_paid ?? 0).toFixed(2)}
              </Text>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: "black",
                marginBottom: 5,
              }}
            />

            <View style={{ flexDirection: "row", marginBottom: 5 }}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "bold",
                  width: 100,
                  textAlign: "right",
                }}
              >
                Amount Due:
              </Text>
              <Text style={{ fontSize: 10, width: 80, textAlign: "right" }}>
                {statementData.currency} {statementData.amount_due?.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Transactions Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.dateColumn}>
              <Text style={styles.tableHeaderCell}>Date</Text>
            </View>
            <View style={styles.transactionColumn}>
              <Text style={styles.tableHeaderCell}>Transactions</Text>
            </View>
            <View style={styles.detailsColumn}>
              <Text style={styles.tableHeaderCell}>Details</Text>
            </View>
            <View style={styles.amountColumn}>
              <Text style={styles.tableHeaderCell}>Amount</Text>
            </View>
            <View style={styles.paymentsColumn}>
              <Text style={styles.tableHeaderCell}>Payments</Text>
            </View>
            <View style={styles.balanceColumn}>
              <Text style={styles.tableHeaderCell}>Balance</Text>
            </View>
          </View>

          {/* Opening Balance Row */}
          <View style={[styles.tableRow, styles.highlightedRow]}>
            <View style={styles.dateColumn}>
              <Text style={styles.tableCell}>
                {moment(statementData.opening_balance_date).format(
                  "MM/DD/YYYY"
                )}
              </Text>
            </View>
            <View style={styles.transactionColumn}>
              <Text style={styles.tableCell}>*Opening Balance*</Text>
            </View>
            <View style={styles.detailsColumn}>
              <Text style={styles.tableCell}></Text>
            </View>
            <View style={styles.amountColumn}>
              <Text style={styles.tableCell}></Text>
            </View>
            <View style={styles.paymentsColumn}>
              <Text style={styles.tableCell}></Text>
            </View>
            <View style={styles.balanceColumn}>
              <Text style={styles.tableCell}>
                {statementData.currency}{" "}
                {statementData.opening_balance.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Group and sort entries by invoice and date */}
          {(() => {
            // Create a map of invoice IDs to their entries (both invoices and payments)
            const invoiceGroups = new Map<number, InvoiceGroup>();

            // First, identify all invoice entries
            activeEntries.forEach((entry) => {
              if (
                entry.transaction_type === "Invoice" &&
                entry.invoice_id != null // Ensures invoice_id is neither null nor undefined
              ) {
                invoiceGroups.set(entry.invoice_id, {
                  invoice: entry,
                  payments: [],
                });
              }
            });

            // Then, add payments to their respective invoice groups
            activeEntries.forEach((entry) => {
              if (
                entry.transaction_type === "Payment Received" &&
                entry.invoice_id != null &&
                invoiceGroups.has(entry.invoice_id)
              ) {
                const group = invoiceGroups.get(entry.invoice_id);
                if (group) {
                  group.payments.push(entry);
                }
              }
            });

            // Convert the map to an array and sort by invoice date
            const sortedGroups = Array.from(invoiceGroups.values()).sort(
              (a, b) =>
                new Date(a.invoice.date).getTime() -
                new Date(b.invoice.date).getTime()
            );

            // Flatten the sorted groups into rows for rendering
            const rows: StatementEntryType[] = [];

            sortedGroups.forEach((group) => {
              // Add the invoice row
              rows.push(group.invoice);

              // Sort payments by date and add them
              const sortedPayments = group.payments.sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              );

              sortedPayments.forEach((payment) => {
                rows.push(payment);
              });
            });

            // Handle any entries that aren't associated with invoices
            const orphanEntries = activeEntries.filter(
              (entry) =>
                entry.transaction_type !== "Invoice" &&
                entry.transaction_type !== "Payment Received"
            );

            // Add orphan entries to the rows
            rows.push(...orphanEntries);

            // Render all rows
            return rows.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  ...(item.transaction_type === "Payment Received"
                    ? [styles.highlightedRow]
                    : []),
                ]}
              >
                <View style={styles.dateColumn}>
                  <Text style={styles.tableCell}>
                    {moment(item.date).format("MM/DD/YYYY")}
                  </Text>
                </View>
                <View style={styles.transactionColumn}>
                  <Text style={styles.tableCell}>{item.transaction_type}</Text>
                </View>
                <View style={styles.detailsColumn}>
                  <Text style={styles.tableCell}>{item.reference}</Text>
                </View>
                <View style={styles.amountColumn}>
                  <Text style={styles.tableCell}>
                    {item.amount != null && item.amount > 0
                      ? `${item.currency} ${item.amount.toFixed(2)}`
                      : ""}
                  </Text>
                </View>

                <View style={styles.paymentsColumn}>
                  <Text style={styles.tableCell}>
                    {item.payment != null && item.payment > 0
                      ? `${item.currency} ${item.payment.toFixed(2)}`
                      : ""}
                  </Text>
                </View>
                <View style={styles.balanceColumn}>
                  <Text style={styles.tableCell}>
                    {item.balance != null
                      ? `${item.currency} ${item.balance.toFixed(2)}`
                      : ""}
                  </Text>
                </View>
              </View>
            ));
          })()}
        </View>
        {/* Balance Due Summary */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: "bold", marginRight: 10 }}>
            Balance Due:
          </Text>
          <Text style={{ fontSize: 11, fontWeight: "bold" }}>
            {statementData.currency}{" "}
            {(statementData.amount_due ?? 0).toFixed(2)}
          </Text>
        </View>

        {/* Balance Due Summary */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>PAYMENT OPTIONS</Text>
          <Text style={styles.paymentInfo}>
            Bank Transfer to {statementData?.payment_option?.account_name},{" "}
            {statementData?.payment_option?.currency !== "AED"
              ? `${statementData?.payment_option?.currency} `
              : "Dirham "}
            A/c # with {statementData?.payment_option?.bank_name}
          </Text>
          {statementData?.payment_option?.iban && (
            <Text style={styles.paymentInfo}>
              IBAN: {formatIBAN(statementData.payment_option.iban)}
            </Text>
          )}

          <Text style={styles.paymentInfo}>
            Swift/BIC Code: {statementData?.payment_option?.swift_code}
          </Text>
          {statementData?.payment_option?.bank_address && (
            <Text style={styles.paymentInfo}>
              Bank Address: {statementData?.payment_option?.bank_address}
            </Text>
          )}
          <View style={[styles.row]}>
            <Text style={{ width: 60, fontSize: 9 }}>Cheque</Text>
            <Text style={{ fontSize: 9 }}>
              Payable to &quot;
              {statementData?.payment_option?.account_name}
              &quot;
            </Text>
          </View>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Level 10, Office 1005{" "}
            <Text style={styles.highlight}>
              Business Gate Center Ibn Battuta Gate
            </Text>{" "}
            Dubai - UAE
          </Text>
        </View>
      </Page>
    </Document>
  );
}
