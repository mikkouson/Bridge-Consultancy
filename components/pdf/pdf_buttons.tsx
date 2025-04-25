"use client";
import { InvoicesSchemaType } from "@/app/types/invoices.type";
import { pdf } from "@react-pdf/renderer";
import { Download, Printer } from "lucide-react";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { InvoiceDocument } from "./invoice-pdf-template";

// Dynamically import the entire @react-pdf/renderer package
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

export default function InvoicePage({
  invoiceData,
}: {
  invoiceData: InvoicesSchemaType;
}) {
  const fileName = `${invoiceData?.invoice_type}_${invoiceData?.invoice_number}_from_Bridge_Consultancy.pdf`;
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const handlePrint = async () => {
    try {
      const blob = await pdf(
        <InvoiceDocument invoiceData={invoiceData} />
      ).toBlob();
      const blobURL = URL.createObjectURL(blob);

      const iframe = iframeRef.current;
      if (iframe) {
        iframe.src = blobURL;

        iframe.onload = () => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        };
      }
    } catch (error) {
      console.error("Error generating PDF for print:", error);
    }
  };

  return (
    <div>
      {invoiceData && (
        <div className="flex justify-center gap-1">
          {/* Wrap PDFDownloadLink in a div since it's dynamically loaded */}
          <div className="cursor-pointer text-gray-600">
            <PDFDownloadLink
              document={<InvoiceDocument invoiceData={invoiceData} />}
              fileName={fileName}
            >
              {({ loading }) =>
                loading ? <span>Loading document...</span> : <Download />
              }
            </PDFDownloadLink>
          </div>

          <button onClick={handlePrint}>
            <Printer className="cursor-pointer text-gray-600" />
          </button>
        </div>
      )}

      {/* Hidden iframe for printing */}
      <iframe ref={iframeRef} style={{ display: "none" }} title="print-frame" />
    </div>
  );
}
