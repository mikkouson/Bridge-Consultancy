import { InvoicesSchemaType } from "@/app/types/invoices.type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import moment from "moment";
import Link from "next/link";

interface InvoiceCardProps {
  invoice: InvoicesSchemaType;
}

export default function CompanyCard({ invoice }: InvoiceCardProps) {
  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "partially":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format date to string representation

  return (
    <Card className="w-full max-w-md shadow-sm">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-sm">{invoice.invoice_type}</h3>
            <p className="text-xs text-muted-foreground">
              #{invoice.invoice_number}
            </p>
          </div>
          <Badge className={`${getStatusColor(invoice?.status || "")}`}>
            {(invoice.status || "UNKNOWN").toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-4 py-2 space-y-1 text-sm">
        <div className="flex justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Client</p>
            {invoice.companies?.name ? (
              <p className="font-medium">{invoice.companies.name}</p>
            ) : (
              <p className="font-medium">
                {invoice.companies?.company_name || "Unknown Client"}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Date</p>
            <p>{moment(invoice.date).format("MMM D, YYYY")}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/50 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-sm flex gap-1">
            Balance:{" "}
            <span className="flex items-center font-semibold gap-1">
              <span className=" font-extralight ">{invoice.currency}</span>
              {(invoice.balance || 0).toFixed(2)}
            </span>
          </span>
        </div>
        <Link href={`payments/${invoice.id}`}>
          <Button variant="ghost" size="sm" className="text-xs">
            Record Payment <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
