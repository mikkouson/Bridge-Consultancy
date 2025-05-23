"use client";
import { useCustomerProfile } from "@/app/hooks/use-company-profile";
import { CustomerForm } from "@/components/customer/form";
import { columns } from "@/components/customer/profile/columns";
import { DataTable } from "@/components/invoices/data-table";
import Loader from "@/components/loader";
import { SheetModal } from "@/components/sheet-modal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  CalendarDays,
  CreditCard,
  DollarSign,
  Mail,
  Phone,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  const { data, isLoading, error } = useCustomerProfile({ id });
  if (isLoading) return <Loader />;

  const customer = data[0];
  // Get initials for avatar
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="container max-w-8xl mx-auto py-12 px-4">
      <Card className="mb-8 border-none bg-card-foreground dark:bg-muted shadow-md  ">
        <CardContent className="p-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-5 text-white w-full">
              <Avatar className="h-16 w-16 border-0 bg-muted-foreground">
                <AvatarFallback className="text-xl font-light bg-muted-foreground">
                  {getInitials(customer.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="mb-1 text-sm font-medium  text-white ">
                  Client
                </div>
                <h1 className="text-3xl font-bold ">{customer.name}</h1>
                <div className="mt-2 flex flex-col gap-2 text-sm  sm:flex-row sm:gap-4">
                  {customer.company_name && (
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 " />
                      {customer.company_name}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" />
                    <span> {customer.email}</span>
                  </div>
                  {customer.contact && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4" />
                      <span> {customer.contact}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex w-full gap-3 justify-end  ">
              <div className="flex gap-3">
                <SheetModal
                  triggerLabel="Create Customer"
                  title="Create Customer"
                  description="Fill in the details to create a new customer."
                  edit={true}
                  button={true}
                >
                  {(setOpen) => (
                    <CustomerForm
                      data={customer}
                      setOpen={setOpen}
                      action="edit"
                    />
                  )}
                </SheetModal>

                <Button variant="default" size="sm">
                  <Link href="/invoices/create" className="gap-1 flex">
                    <Plus />
                    New Invoice
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="h-1 w-full  bg-muted-foreground "></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customer.invoices[0]?.currency} {customer.balance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current outstanding balance
            </p>
          </CardContent>
        </Card>
        <Card>
          <div className="h-1 w-full  bg-muted-foreground "></div>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.invoices.length}</div>
            <p className="text-xs text-muted-foreground">
              Total invoices issued
            </p>
          </CardContent>
        </Card>
        <Card>
          <div className="h-1 w-full  bg-muted-foreground "></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Amount
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customer.invoices[0]?.currency}{" "}
              {customer.invoices
                .reduce(
                  (
                    sum: number,
                    invoice: { status: string; total_amount: number }
                  ) =>
                    sum +
                    (invoice.status === "pending" ? invoice.total_amount : 0),
                  0
                )
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Pending payments</p>
          </CardContent>
        </Card>
        <Card>
          <div className="h-1 w-full  bg-muted-foreground "></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Invoice</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(
                customer.invoices[0]?.created_at || Date.now()
              ).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Most recent invoice date
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="md:col-span-2 lg:col-span-5 mt-12">
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>View and manage customer invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Invoices</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <DataTable
                data={customer.invoices}
                columns={columns}
                placeholder="Filter Invoice Number..."
                column="invoice_number"
              />
            </TabsContent>
            <TabsContent value="pending"></TabsContent>
            <TabsContent value="paid"></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
