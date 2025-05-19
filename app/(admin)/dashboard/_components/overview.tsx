"use client";

import { useInvoice } from "@/app/hooks/use-invoices";
import { AreaGraph } from "./area-graph";
// import { BarGraph } from "./bar-graph";
import { DashboardCards } from "./card";
import { PieGraph } from "./pie-graph";
import { RecentSales } from "./recent-sales";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loader from "@/components/loader";
import { InvoiceChart } from "./invoice-chart";

export default function OverViewPage() {
  const { data, isLoading } = useInvoice();
  if (isLoading) return <Loader />;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Hi, Welcome back 👋
        </h2>
        <div className="hidden items-center space-x-2 md:flex">
          {/* <CalendarDateRangePicker /> */}
          {/* <Button>Download</Button> */}
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        {/* <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Analytics
          </TabsTrigger>
        </TabsList> */}
        <TabsContent value="overview" className="space-y-4">
          <DashboardCards invoices={data} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-7">
              <InvoiceChart chartData={data} />
            </div>
            {/* <Card className="col-span-4 md:col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  You made 265 sales this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card> */}
            <div className="col-span-7">
              <AreaGraph invoiceData={data} />
            </div>
            {/* <div className="col-span-4 md:col-span-3">
              <PieGraph />
            </div> */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
