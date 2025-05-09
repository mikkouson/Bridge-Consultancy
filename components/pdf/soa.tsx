"use client";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import moment from "moment";

// Register fonts
Font.register({
  family: "Courier",
  src: "https://fonts.gstatic.com/s/courierprime/v9/u-450q2lgwslOqpF_6gQ8kELWwZjW-_-tvg.ttf",
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: "20mm",
    fontFamily: "Courier",
    fontSize: 11,
    color: "#333333",
    lineHeight: 1.5,
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 80,
    objectFit: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000066",
    textAlign: "right",
    marginTop: 20,
  },
  companyInfo: {
    marginTop: 10,
    marginBottom: 20,
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    marginTop: 2,
  },
  infoLabel: {
    width: 80,
    fontWeight: "bold",
  },
  statementInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  leftColumn: {
    width: "50%",
  },
  rightColumn: {
    width: "50%",
    alignItems: "flex-end",
  },
  statementRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  statementLabel: {
    width: 120,
    textAlign: "right",
    paddingRight: 10,
  },
  statementValue: {
    width: 100,
    textAlign: "right",
  },
  table: {
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#000",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    backgroundColor: "#e6f7f2",
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  dateCell: {
    width: "15%",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "center",
  },
  transactionCell: {
    width: "20%",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  detailsCell: {
    width: "25%",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  amountCell: {
    width: "15%",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "right",
  },
  paymentsCell: {
    width: "15%",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "right",
  },
  balanceCell: {
    width: "10%",
    padding: 5,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    backgroundColor: "#f2f2f2",
  },
  totalLabel: {
    width: "75%",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "right",
    fontWeight: "bold",
  },
  totalValue: {
    width: "25%",
    padding: 5,
    textAlign: "right",
    fontWeight: "bold",
  },
  paymentInstructions: {
    marginTop: 20,
    marginBottom: 20,
  },
  instructionTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  instructionTable: {
    borderWidth: 1,
    borderColor: "#000",
  },
  instructionRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    backgroundColor: "#e6f7f2",
  },
  instructionNumberCell: {
    width: "5%",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "center",
  },
  instructionTextCell: {
    width: "95%",
    padding: 5,
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 10,
  },
});

// Format currency
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "0.00";
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  return moment(dateString).format("MM/DD/YYYY");
};

export function StatementOfAccount({ data }) {
  // Extract company and invoice data
  const company = data[0];
  const invoices = company.invoices || [];

  // Current date for statement date
  const currentDate = moment().format("MM/DD/YYYY");

  // Generate a statement number (using current timestamp)
  const statementNumber = `SOA-${Date.now().toString().slice(-6)}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo and Title */}
        <View style={styles.header}>
          <Image
            src="/placeholder.svg?height=80&width=120"
            style={styles.logo}
          />
          <Text style={styles.title}>STATEMENT of ACCOUNTS</Text>
        </View>

        {/* Company and Statement Information */}
        <View style={styles.statementInfo}>
          <View style={styles.leftColumn}>
            <Text style={styles.companyName}>{company.company_name}</Text>
            <Text>{company.name}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text>{company.contact}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text>{company.email}</Text>
            </View>
          </View>
          <View style={styles.rightColumn}>
            <View style={styles.statementRow}>
              <Text style={styles.statementLabel}>Statement Date</Text>
              <Text style={styles.statementValue}>{currentDate}</Text>
            </View>
            <View style={styles.statementRow}>
              <Text style={styles.statementLabel}>Statement No</Text>
              <Text style={styles.statementValue}>{statementNumber}</Text>
            </View>
            <View style={styles.statementRow}>
              <Text style={styles.statementLabel}>Opening Balance</Text>
              <Text style={styles.statementValue}>€ 0.00</Text>
            </View>
            <View style={styles.statementRow}>
              <Text style={styles.statementLabel}>Invoiced Amount</Text>
              <Text style={styles.statementValue}>
                € {formatCurrency(company.balance)}
              </Text>
            </View>
            <View style={styles.statementRow}>
              <Text style={styles.statementLabel}>Amount Paid</Text>
              <Text style={styles.statementValue}>€ 0.00</Text>
            </View>
            <View style={styles.statementRow}>
              <Text style={styles.statementLabel}>Amount Due</Text>
              <Text style={styles.statementValue}>
                € {formatCurrency(company.balance)}
              </Text>
            </View>
          </View>
        </View>

        {/* Transactions Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.dateCell}>Date</Text>
            <Text style={styles.transactionCell}>Transactions</Text>
            <Text style={styles.detailsCell}>Details</Text>
            <Text style={styles.amountCell}>Amount</Text>
            <Text style={styles.paymentsCell}>Payments</Text>
            <Text style={styles.balanceCell}>Balance</Text>
          </View>

          {/* Opening Balance Row */}
          <View style={styles.tableRow}>
            <Text style={styles.dateCell}>{formatDate(invoices[0]?.date)}</Text>
            <Text style={styles.transactionCell}>***Opening Balance***</Text>
            <Text style={styles.detailsCell}></Text>
            <Text style={styles.amountCell}>€ 0.00</Text>
            <Text style={styles.paymentsCell}></Text>
            <Text style={styles.balanceCell}>€ 0.00</Text>
          </View>

          {/* Invoice and Payment Rows */}
          {invoices.map((invoice, index) => {
            // Track running balance
            let runningBalance = index === 0 ? 0 : null; // Start with 0 for first invoice

            // Calculate running balance based on previous entries if not first item
            if (index > 0) {
              runningBalance = invoices.slice(0, index).reduce((total, inv) => {
                // Add invoice amount
                total += inv.total_amount;
                // Subtract any payments
                if (inv.payments && inv.payments.length > 0) {
                  inv.payments.forEach((payment) => {
                    total -= payment.amount || 0;
                  });
                }
                return total;
              }, 0);
            }

            // Calculate this invoice's impact on balance
            const invoiceBalance = runningBalance + invoice.total_amount;

            return (
              <>
                {/* Invoice Row */}
                <View
                  key={`invoice-${invoice.id}`}
                  style={index % 2 === 0 ? styles.tableRowAlt : styles.tableRow}
                >
                  <Text style={styles.dateCell}>
                    {formatDate(invoice.date)}
                  </Text>
                  <Text style={styles.transactionCell}>Invoice</Text>
                  <Text style={styles.detailsCell}>
                    Invoice {invoice.invoice_number}
                  </Text>
                  <Text style={styles.amountCell}>
                    € {formatCurrency(invoice.total_amount)}
                  </Text>
                  <Text style={styles.paymentsCell}></Text>
                  <Text style={styles.balanceCell}>
                    € {formatCurrency(invoiceBalance)}
                  </Text>
                </View>

                {/* Payment Rows (if any) */}
                {invoice.payments &&
                  invoice.payments.map((payment, paymentIndex) => {
                    // Update balance after this payment
                    const paymentBalance =
                      invoiceBalance - (payment.amount || 0);

                    return (
                      <View
                        key={`payment-${invoice.id}-${paymentIndex}`}
                        style={
                          index % 2 === 0 ? styles.tableRow : styles.tableRowAlt
                        }
                      >
                        <Text style={styles.dateCell}>
                          {formatDate(payment.date || invoice.date)}
                        </Text>
                        <Text style={styles.transactionCell}>
                          Payment Received
                        </Text>
                        <Text style={styles.detailsCell}>Payment</Text>
                        <Text style={styles.amountCell}></Text>
                        <Text style={styles.paymentsCell}>
                          € {formatCurrency(payment.amount || 0)}
                        </Text>
                        <Text style={styles.balanceCell}>
                          € {formatCurrency(paymentBalance)}
                        </Text>
                      </View>
                    );
                  })}
              </>
            );
          })}

          {/* Balance Due Row */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Balance Due:</Text>
            <Text style={styles.totalValue}>
              € {formatCurrency(company.balance)}
            </Text>
          </View>
        </View>

        {/* Payment Instructions */}
        <View style={styles.paymentInstructions}>
          <Text style={styles.instructionTitle}>Payment Instructions</Text>
          <View style={styles.instructionTable}>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionNumberCell}>1</Text>
              <Text style={styles.instructionTextCell}>
                Please make checks payable to {company.company_name}.
              </Text>
            </View>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionNumberCell}>2</Text>
              <Text style={styles.instructionTextCell}>
                Online payments can be made to Bank Account:{" "}
                {invoices[0]?.payment_options?.iban || "[Account Number]"}.
              </Text>
            </View>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionNumberCell}>3</Text>
              <Text style={styles.instructionTextCell}>
                Include your Invoice Number as a reference for all payments.
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            For any inquiries or discrepancies, please contact our Accounts
            Department at {company.contact} or email us at {company.email}.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
