"use client";
import { InvoicesSchemaType } from "@/app/types/invoices.type";
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
    width: 200,
    height: 100,
    objectFit: "fill",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftColumn: {
    width: "50%",
  },
  rightColumn: {
    width: "50%",
    alignItems: "flex-end",
  },
  inv: {
    alignItems: "flex-start",
  },
  row: {
    flexDirection: "row",
  },
  invoice: {
    lineHeight: 1,
    flexDirection: "row",
    textAlign: "left",
  },
  trnrow: {
    flexDirection: "row",
    marginBottom: 20,
    fontSize: 13,
  },
  label: {
    width: 100,
  },
  label1: {
    width: 30,
  },
  value: {
    flex: 1,
  },
  table: {
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#000",
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#e5e5e5",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableRowEven: {
    flexDirection: "row",
    backgroundColor: "#f3f3f3",
  },
  tableRowOdd: {
    flexDirection: "row",
  },
  tableCell: {
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  dateCell: {
    width: "25%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "center",
  },
  equivalentCell: {
    backgroundColor: "white",
    width: "25%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "left",
    paddingLeft: "5px",
  },
  descriptionCell: {
    width: "50%",
    paddingLeft: "5px",
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "left",
  },

  descriptionHeader: {
    width: "50%",
    paddingLeft: "5px",
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "center",
  },
  descriptionCell1: {
    width: "50%",
    paddingLeft: "5px",
    borderRightWidth: 1,
    borderRightColor: "black",
    backgroundColor: "white",
  },

  amountCell: {
    width: "25%",
    textAlign: "right",
  },
  amountCell1: {
    width: "25%",
    textAlign: "right",
    backgroundColor: "white",
  },
  spacerRow: {
    height: 13,
    backgroundColor: "white",
  },
  totalsSection: {
    marginBottom: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontWeight: "bold",
  },
  vat: {
    fontWeight: "normal",
  },
  totalAmount: {
    textAlign: "right",
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
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontWeight: "bold",
  },
  highlight: {
    color: "#651f65",
  },
  underline: {
    textDecoration: "underline",
  },
});

const formatIBAN = (iban: string) => {
  if (!iban) return "";
  const part1 = iban.slice(0, 3); // AE5
  const part2 = iban.slice(3, 7); // 1086
  const part3 = iban.slice(7); // 000000932336900
  return `${part1} ${part2} ${part3}`;
};

// Helper function to format the date as a string

const formatDate = (date: Date | undefined): string => {
  if (!date) return "";
  return moment(date).format("MM/DD/YYYY");
};

export function InvoiceDocument({
  invoiceData,
}: {
  invoiceData: InvoicesSchemaType;
}) {
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "0.00";
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Calculate total number of rows needed
  const totalServices = invoiceData?.invoice_services?.length ?? 0;
  const rowsNeeded = 11 - totalServices - 1;

  // Get company info with fallbacks
  const companyName = invoiceData.companies?.name || "Company Name";

  const companyRepresentative =
    invoiceData.companies?.representative || "Company Representative"; // Replace with actual data if available
  const companyEmail = invoiceData.companies?.email || "company@example.com"; // Replace with actual data if available

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src="/bridge.jpg" style={styles.logo} />
          <Text style={styles.title}>{invoiceData.invoice_type}</Text>
        </View>

        {/* Client Info and Invoice Details */}
        <View style={styles.infoSection}>
          <View style={styles.leftColumn}>
            <View style={styles.row}>
              <Text style={styles.label1}>To:</Text>
              <Text>{companyName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label1}></Text>
              <Text>{companyRepresentative}</Text>
            </View>
          </View>
          <View style={styles.rightColumn}>
            <View style={styles.trnrow}>
              <Text>TRN # {invoiceData.trn}</Text>
            </View>
            <View style={styles.inv}>
              <View style={styles.invoice}>
                <Text style={styles.label}>INVOICE NO:</Text>
                <Text>{invoiceData.invoice_number}</Text>
              </View>
              <View style={styles.invoice}>
                <Text style={styles.label}>INVOICE DATE:</Text>
                <Text>{formatDate(invoiceData.date)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Delivery Info */}
        <View style={{ marginTop: 20 }}>
          <View style={styles.row}>
            <Text style={styles.label}>Inv. Delivery:</Text>
            <Text>via email</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text>{companyEmail}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Subject:</Text>
            <Text>{invoiceData.subject}</Text>
          </View>
        </View>

        {/* Services Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.dateCell}>Service Date</Text>
            <Text style={styles.descriptionHeader}>Description</Text>
            <Text style={styles.amountCell}>
              Amount ({invoiceData.currency})
            </Text>
          </View>

          {/* Table Rows - services with alternating colors */}
          {invoiceData?.invoice_services?.map((service, index) => (
            <View
              key={service.id || index}
              style={index % 2 === 0 ? styles.tableRowOdd : styles.tableRowEven}
            >
              <Text style={styles.dateCell}>
                {formatDate(service.service_date)}
              </Text>
              <Text style={styles.descriptionCell}>{service.service_name}</Text>
              <Text style={styles.amountCell}>
                {formatCurrency(service.amount)}
                {service.service_vat && "T"}
              </Text>
            </View>
          ))}

          {/* Empty rows to reach 12 total rows with alternating colors */}
          {Array.from({ length: rowsNeeded }).map((_, index) => (
            <View
              key={`empty-${index}`}
              style={[
                (totalServices + index) % 2 === 0
                  ? styles.tableRowOdd
                  : styles.tableRowEven,
                styles.spacerRow,
              ]}
            >
              <Text style={styles.dateCell}>&nbsp;</Text>
              <Text style={styles.descriptionCell}>&nbsp;</Text>
              <Text style={styles.amountCell}>&nbsp;</Text>
            </View>
          ))}

          {/* "Equivalent" row (11th row in original, now will be the 12th) */}
          <View
            style={
              (totalServices + rowsNeeded) % 2 === 0
                ? styles.tableRowOdd
                : styles.tableRowEven
            }
          >
            <Text style={styles.equivalentCell}>Equivalent:</Text>
            <Text style={styles.descriptionCell1}></Text>
            <Text style={styles.amountCell1}></Text>
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>INVOICE AMOUNT</Text>
            <Text style={styles.totalAmount}>
              {invoiceData.currency}{" "}
              {invoiceData?.amount?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.vat}>VAT 5%</Text>
            <Text style={styles.totalAmount}>
              {`${
                invoiceData.currency
              } ${invoiceData?.total_vat_amount?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            </Text>
          </View>
          <View style={[styles.totalRow, { marginTop: 5 }]}>
            <Text style={[styles.totalLabel, { fontSize: 12 }]}>
              TOTAL INVOICE AMOUNT:
            </Text>
            <Text style={[styles.totalAmount, styles.underline]}>
              {invoiceData.currency}{" "}
              {invoiceData?.total_amount?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>

        {/* Payment Options */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>PAYMENT OPTIONS</Text>
          <Text style={styles.paymentInfo}>
            Bank Transfer to {invoiceData?.payment_options?.account_name},{" "}
            {invoiceData?.payment_options?.currency !== "AED"
              ? `${invoiceData?.payment_options?.currency} `
              : "Dirham "}
            A/c # with {invoiceData?.payment_options?.bank_name}
          </Text>
          {invoiceData?.payment_options?.iban && (
            <Text style={styles.paymentInfo}>
              IBAN: {formatIBAN(invoiceData.payment_options.iban)}
            </Text>
          )}

          <Text style={styles.paymentInfo}>
            Swift/BIC Code: {invoiceData?.payment_options?.swift_code}
          </Text>
          {invoiceData?.payment_options?.bank_address && (
            <Text style={styles.paymentInfo}>
              Bank Address: {invoiceData?.payment_options?.bank_address}
            </Text>
          )}
          <View style={[styles.row]}>
            <Text style={{ width: 60, fontSize: 9 }}>Cheque</Text>
            <Text style={{ fontSize: 9 }}>
              Payable to &quot;{invoiceData?.payment_options?.account_name}
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
