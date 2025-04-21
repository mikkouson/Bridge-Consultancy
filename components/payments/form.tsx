"use client";

import { PaymentsSchemaType, PaymentsSchema } from "@/app/types/payments";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Asterisk,
  CalendarIcon,
  CheckCircle,
  ChevronDown,
  CircleAlert,
  Percent,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { updatePayment, createPayment } from "@/app/(admin)/payments/actions";
import { Textarea } from "../ui/textarea";
import { ComboboxForm } from "../popover";
import { InvoicesSchemaType } from "@/app/types/invoices.type";
const payment_mode = [
  { id: "Bank Transfer", name: "Bank Transfer" },
  { id: "Cash", name: "Cash" },
  { id: "Crypto", name: "Crypto" },
];
export function PaymentForm({
  data = {},
  id,
  action,
  invoice,
}: {
  id?: string;
  data?: Partial<PaymentsSchemaType>;
  action?: "create" | "edit";
  invoice?: Partial<InvoicesSchemaType>;
}) {
  const form = useForm<z.infer<typeof PaymentsSchema>>({
    resolver: zodResolver(PaymentsSchema),
    defaultValues: {
      id: data?.id ?? 0,
      invoice_id: Number(id),
      date: data?.date,
      amount: data?.amount ?? 0,
      comment: data?.comment ?? "",
      payment_method: data?.payment_method ?? "",
    },
  });
  const { isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof PaymentsSchema>) {
    try {
      if (action === "edit") {
        await updatePayment(data);
      } else {
        await createPayment(data);
      }

      toast({
        variant: "success",
        className: "border-0",
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span>Customer created successfully!</span>
          </div>
        ),
        duration: 2000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        className: "border-0",
        description: (
          <div className="flex items-center gap-2">
            <CircleAlert className="h-5 w-5" />
            <span>
              {error instanceof Error
                ? error.message
                : "An unknown error occurred"}
            </span>
          </div>
        ),
        duration: 2000,
      });
    }
  }
  const currencySymbols: Record<string, string> = {
    AED: "د.إ",
    USD: "$",
    EUR: "€",
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8 mt-4"
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col md:col-span-1 lg: col-span-2">
              <FormLabel className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Date <span className="text-red-500 text-lg">*</span>
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem
              className="
            hidden
        "
            >
              <FormLabel>Invoice ID </FormLabel>
              <FormControl>
                <Input placeholder="Invoice ID" {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => {
            return (
              <FormItem className="gap-2 md:col-span-1 lg: col-span-2">
                <FormLabel>
                  Amount <span className="text-red-500 text-lg">*</span>
                </FormLabel>
                <FormControl>
                  <div className=" flex  gap-2 justify-center items-center">
                    <div className="relative w-full">
                      <Input
                        className="peer pe-12 ps-8 "
                        placeholder="0.00"
                        {...field}
                        type="number"
                        onInput={(e) => {
                          const input = e.currentTarget;
                          const max = invoice?.total_amount; // set your desired max
                          if (max && parseFloat(input.value) > max) {
                            input.valueAsNumber = max;
                          }
                        }}
                      />
                      <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-sm text-muted-foreground peer-disabled:opacity-50">
                        {invoice?.currency
                          ? currencySymbols[invoice.currency] ?? "AED"
                          : "AED"}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                        {invoice?.currency}
                      </span>
                    </div>
                    <Button
                      type="button"
                      onClick={() =>
                        form.setValue("amount", invoice?.total_amount ?? 0)
                      }
                    >
                      Max
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="md:col-span-1 lg: col-span-2">
          <FormLabel>
            Payment Mode <span className="text-red-500 text-lg">*</span>
          </FormLabel>
          <ComboboxForm
            data={payment_mode}
            form={form}
            name="payment_method"
            formName="name"
          />
        </div>

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="flex flex-col md:col-span-1 lg: col-span-2">
              <FormLabel>
                Comment{" "}
                <span className=" text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Comment"
                  {...field}
                  className="min-h-[80px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
