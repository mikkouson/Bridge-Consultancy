"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

// Define the interface for chart data items
interface InvoiceItem {
  invoice: string;
  amount: number;
}

const chartConfig = {
  amount: {
    label: "Amount (AED)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface InvoiceChartProps {
  chartData: InvoiceItem[];
}

export function InvoiceChart({ chartData }: InvoiceChartProps) {
  // Calculate total amount
  const totalAmount = chartData.reduce(
    (sum: number, item: InvoiceItem) => sum + item.amount,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paid Invoice Amounts</CardTitle>
        <CardDescription>
          Total: {totalAmount.toLocaleString()} AED
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="invoice"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(value) => `${value.toLocaleString()}`}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => `${Number(value).toLocaleString()} AED`}
                  labelFormatter={(label) => `Invoice: ${label}`}
                />
              }
            />
            <Bar
              dataKey="amount"
              fill="var(--color-amount)"
              radius={8}
              name="Amount"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total Invoice Amount: {totalAmount.toLocaleString()} AED
        </div>
        <div className="leading-none text-muted-foreground">
          Showing only paid invoices
        </div>
      </CardFooter>
    </Card>
  );
}
