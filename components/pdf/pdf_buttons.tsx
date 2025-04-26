"use client";
import { InvoicesSchemaType } from "@/app/types/invoices.type";
import { pdf } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { InvoiceDocument } from "./invoice-pdf-template";
import { Button } from "../ui/button";

// Dynamically import the entire @react-pdf/renderer package
const PDFDownloadLink = dynamic(
  () => import("@/components/pdf/PDFDownloadLink"),
  {
    ssr: false,
    loading: () => (
      <Button variant="ghost" className="w-full justify-start" disabled>
        Download
      </Button>
    ),
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
        <div className="flex flex-col justify-center gap-1">
          {/* Wrap PDFDownloadLink in a div since it's dynamically loaded */}
          <div className="cursor-pointer ">
            <PDFDownloadLink
              document={<InvoiceDocument invoiceData={invoiceData} />}
              fileName={fileName}
            >
              {({ loading }) =>
                loading ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    aria-disabled={loading}
                  >
                    Download
                  </Button>
                ) : (
                  <Button variant="ghost" className="w-full justify-start">
                    Download
                  </Button>
                )
              }
            </PDFDownloadLink>
          </div>

          <Button
            onClick={handlePrint}
            variant="ghost"
            className="w-full justify-start"
          >
            Print
          </Button>
        </div>
      )}

      {/* Hidden iframe for printing */}
      <iframe ref={iframeRef} style={{ display: "none" }} title="print-frame" />
    </div>
  );
}
