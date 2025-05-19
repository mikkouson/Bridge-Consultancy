"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define interface for invoice data
interface Invoice {
  date: string;
  status: "paid" | "pending" | string;
  total_amount: number;
}

// Define interface for daily chart data
interface DailyChartData {
  date: string;
  formattedDate: string;
  paid: number;
  pending: number;
}

// Transform invoice data into daily chart-friendly format
const transformInvoiceData = (invoiceData: Invoice[]): DailyChartData[] => {
  // Create a map to store daily totals
  const dailyData = new Map<string, DailyChartData>();

  // Process each invoice
  if (invoiceData && Array.isArray(invoiceData)) {
    // Sort invoices by date
    const sortedInvoices = [...invoiceData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Get date range
    let startDate = new Date();
    let endDate = new Date();

    if (sortedInvoices.length > 0) {
      startDate = new Date(sortedInvoices[0].date);
      endDate = new Date(sortedInvoices[sortedInvoices.length - 1].date);

      // If we have less than 30 days of data, extend to at least 30 days
      const daysDiff = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff < 30) {
        // Add some days before and after to create a better visual
        const newStartDate = new Date(startDate);
        newStartDate.setDate(newStartDate.getDate() - 5);

        const newEndDate = new Date(endDate);
        newEndDate.setDate(newEndDate.getDate() + 5);

        startDate = newStartDate;
        endDate = newEndDate;
      }
    } else {
      // Default to last 30 days if no invoices
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
    }

    // Initialize all days in the range with zeros
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      dailyData.set(dateStr, {
        date: dateStr,
        formattedDate: formatDate(dateStr),
        paid: 0,
        pending: 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Fill in the actual invoice data
    sortedInvoices.forEach((invoice) => {
      const dateStr = new Date(invoice.date).toISOString().split("T")[0];

      if (dailyData.has(dateStr)) {
        const dayData = dailyData.get(dateStr)!;

        // Update based on invoice status
        if (invoice.status === "paid") {
          dayData.paid += invoice.total_amount;
        } else {
          dayData.pending += invoice.total_amount;
        }
      }
    });
  }

  // Convert map to array for the chart
  return Array.from(dailyData.values());
};

// Format date for display
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const chartConfig = {
  paid: {
    label: "Paid Invoices",
    color: "hsl(var(--chart-1))",
  },
  pending: {
    label: "Pending Invoices",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface AreaGraphProps {
  invoiceData: Invoice[];
}

export function AreaGraph({ invoiceData }: AreaGraphProps) {
  // Generate chart data from the provided invoice data
  const chartData = transformInvoiceData(invoiceData);

  // Get date range for display
  const startDate = chartData.length > 0 ? chartData[0].formattedDate : "";
  const endDate =
    chartData.length > 0 ? chartData[chartData.length - 1].formattedDate : "";
  const dateRange =
    startDate && endDate ? `${startDate} - ${endDate}` : "No data available";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Invoice Analytics</CardTitle>
        <CardDescription>
          Showing paid and pending invoices by day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="formattedDate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // Show fewer ticks for readability
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value} AED`}
              domain={[0, "dataMax + 1000"]} // Add some padding to the top
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="pending"
              type="natural"
              fill="var(--color-pending, #f59e0b)"
              fillOpacity={0.4}
              stroke="var(--color-pending, #f59e0b)"
              stackId="a"
            />
            <Area
              dataKey="paid"
              type="natural"
              fill="var(--color-paid, #10b981)"
              fillOpacity={0.4}
              stroke="var(--color-paid, #10b981)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {invoiceData.length > 0 ? (
                <>
                  Showing {invoiceData.length} invoice(s){" "}
                  <TrendingUp className="h-4 w-4" />
                </>
              ) : (
                "No invoice data available"
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {dateRange}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
