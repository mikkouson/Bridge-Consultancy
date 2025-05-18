"use client";
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

type TableData = {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | Date
    | Record<string, unknown>;
};

const PDFTable = ({ title, data }: { title: string; data: TableData[] }) => {
  if (data.length === 0) return null;
  const filteredData = data.map(({ id, deleted_at, ...rest }) => rest);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        <View>
          <View style={[styles.row, styles.header]}>
            {Object.keys(filteredData[0]).map((key) => (
              <Text key={key} style={styles.cell}>
                {key.toUpperCase()}
              </Text>
            ))}
          </View>
          {filteredData.map((row, index) => (
            <View key={index} style={styles.row}>
              {Object.keys(row).map((key) => (
                <Text key={key} style={styles.cell}>
                  {String(row[key] ?? "-")}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export const PdfExport = ({
  title,
  data,
  fileName,
}: {
  title: string;
  data: TableData[];
  fileName: string;
}) => {
  return (
    <PDFDownloadLink
      document={<PDFTable title={title} data={data} />}
      fileName={fileName}
      className="w-full"
    >
      {({ loading }) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-sm w-full text-left justify-start p-0"
        >
          <span className="w-full text-left">
            {loading ? "Exporting..." : "PDF"}
          </span>
        </Button>
      )}
    </PDFDownloadLink>
  );
};
