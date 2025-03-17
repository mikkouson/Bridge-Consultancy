"use client";
import { CompanySchemaType } from "@/app/types/companies.type";
import { Button } from "@/components/ui/button";
import {
  Document,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
  },
  header: {
    fontWeight: "bold",
    backgroundColor: "#f3f4f6",
    paddingVertical: 6,
  },
  cell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
    textAlign: "left",
    wordWrap: "break-word",
  },
});

const PDFTable = ({ data }: { data: CompanySchemaType[] }) => {
  const filteredData = data.map(({ id, deleted_at, ...rest }) => rest);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Company Directory Report</Text>
        <View>
          <View style={[styles.row, styles.header]}>
            {Object.keys(filteredData[0] || {}).map((key) => (
              <Text key={key} style={styles.cell}>
                {key.toUpperCase()}
              </Text>
            ))}
          </View>
          {filteredData.map((row, index) => (
            <View key={index} style={styles.row}>
              {Object.keys(row).map((key) => (
                <Text key={key} style={styles.cell}>
                  {String(row[key as keyof typeof row]) || "-"}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export const PdfExport = ({ data }: { data: CompanySchemaType[] }) => {
  return (
    <PDFDownloadLink
      document={<PDFTable data={data} />}
      fileName="companies.pdf"
      className="w-full"
    >
      {({ loading }) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-sm  w-full text-left justify-start p-0"
        >
          <span className=" w-ful text-left">
            {loading ? "Exporting..." : "PDF"}
          </span>
        </Button>
      )}
    </PDFDownloadLink>
  );
};
