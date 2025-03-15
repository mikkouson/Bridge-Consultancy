"use client";
import { CompanySchemaType } from "@/app/types/companies.type";
import { SheetDemo } from "@/components/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Document,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { Table } from "@tanstack/react-table";
import { ArrowDownToLine, FileText, X } from "lucide-react";
import { CSVLink } from "react-csv";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData extends object> {
  table: Table<TData>;
  data: TData[];
}

// PDF Styles
const styles = StyleSheet.create({
  page: { padding: 20 },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
    alignItems: "center",
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

// PDF Table Component
const PDFTable = ({ data }: { data: CompanySchemaType[] }) => {
  // Filter out unwanted columns
  const filteredData = data.map(({ id, deleted_at, ...rest }) => rest);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Company Directory Report</Text>
        <View style={styles.table}>
          {/* Table Header */}
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
                  {String((row as Record<string, unknown>)[key]) || "-"}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export function DataTableToolbar<TData extends CompanySchemaType>({
  table,
  data,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter company name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset <X className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        {/* Export CSV */}
        <CSVLink data={data} filename="companies.csv">
          <Button variant="outline" size="sm" className="text-sm px-2">
            <ArrowDownToLine size={14} />
            <span className="sr-only sm:not-sr-only ml-2">Export CSV</span>
          </Button>
        </CSVLink>

        {/* Export PDF */}
        <PDFDownloadLink
          document={<PDFTable data={data} />}
          fileName="companies.pdf"
        >
          {({ loading }) => (
            <Button variant="outline" size="sm" className="text-sm px-2">
              <FileText size={14} />
              <span className="sr-only sm:not-sr-only ml-2">
                {loading ? "Generating..." : "Export PDF"}
              </span>
            </Button>
          )}
        </PDFDownloadLink>

        <DataTableViewOptions table={table} data={data} />
        <SheetDemo />
      </div>
    </div>
  );
}
