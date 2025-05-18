"use client";
import { pdf } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { Button } from "../ui/button";
import { StatementDocument } from "./soa-pdf-template";
import { SoaSchemaType } from "@/app/types/soa";

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

export default function StatementPage({
  statementData,
}: {
  statementData: SoaSchemaType;
}) {
  // const fileName = `${statementData?.invoice_type}_${statementData?.invoice_number}_from_Bridge_Consultancy.pdf`;
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const handlePrint = async () => {
    try {
      const blob = await pdf(
        <StatementDocument statementData={statementData} />
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
      {statementData && (
        <div className="flex flex-col justify-center gap-1">
          {/* Wrap PDFDownloadLink in a div since it's dynamically loaded */}
          <div className="cursor-pointer ">
            <PDFDownloadLink
              document={<StatementDocument statementData={statementData} />}
              // fileName={fileName}
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
