"use client";
import {
  DollarSign,
  CreditCard,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Invoice {
  id: number;
  total_amount: number;
  exchange_rate: number;
  status: string;
  paid: number;
  balance: number;
}

interface DashboardCardsProps {
  invoices: Invoice[];
}

export function DashboardCards({ invoices }: DashboardCardsProps) {
  // Calculate metrics
  const totalInvoiced = invoices.reduce((sum, invoice) => {
    return sum + invoice.total_amount / invoice.exchange_rate;
  }, 0);

  const totalPaid = invoices.reduce((sum, invoice) => {
    return sum + invoice.paid / invoice.exchange_rate;
  }, 0);

  const totalBalance = invoices.reduce((sum, invoice) => {
    return sum + invoice.balance / invoice.exchange_rate;
  }, 0);

  const invoiceStatus = {
    paid: invoices.filter((invoice) => invoice.status === "paid").length,
    pending: invoices.filter((invoice) => invoice.status === "pending").length,
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalInvoiced)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {invoices.length} total invoices
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalPaid)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {invoiceStatus.paid} paid invoices
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Outstanding Balance
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalBalance)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {invoiceStatus.pending} pending invoices
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Invoice Status</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm">Paid</p>
                <p className="text-sm font-medium">{invoiceStatus.paid}</p>
              </div>
              <div className="h-2 bg-muted rounded overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${(invoiceStatus.paid / invoices.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm">Pending</p>
                <p className="text-sm font-medium">{invoiceStatus.pending}</p>
              </div>
              <div className="h-2 bg-muted rounded overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{
                    width: `${
                      (invoiceStatus.pending / invoices.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
