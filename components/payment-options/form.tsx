"use client";

import {
  createPaymentOption,
  updatePaymentOption,
} from "@/app/(admin)/payment-options/actions";
import {
  PaymentOptionsSchema,
  PaymentOptionsSchemaType,
} from "@/app/types/payment-options.type";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ComboboxForm } from "../popover";
export function PaymentOptionsForm({
  data = {},
  setOpen,
  action,
}: {
  data?: Partial<PaymentOptionsSchemaType>;
  setOpen: (open: boolean) => void;
  action?: "create" | "edit";
}) {
  const form = useForm<z.infer<typeof PaymentOptionsSchema>>({
    resolver: zodResolver(PaymentOptionsSchema),
    defaultValues: {
      id: data.id ?? 0,
      bank_name: data.bank_name ?? "",
      account_name: data.account_name ?? "",
      iban: data.iban ?? "",
      swift_code: data.swift_code ?? "",
      bank_address: data.bank_address ?? "",
      currency: data.currency ?? "",
    },
  });
  const { isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof PaymentOptionsSchema>) {
    try {
      if (action === "edit") {
        await updatePaymentOption(data);
      } else {
        await createPaymentOption(data);
      }

      toast({
        title: "Success",
        description: "Company created successfully",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }
  const currencyData = [
    { id: "AED", currency: "UAE Dirham (AED)", symbol: "د.إ" },
    { id: "USD", currency: "US Dollar (USD)", symbol: "$" },
    { id: "EUR", currency: "Euro (EUR)", symbol: "€" },
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8 mt-4"
      >
        <FormField
          control={form.control}
          name="bank_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Name</FormLabel>
              <FormControl>
                <Input placeholder="Bank Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="account_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input placeholder="Account Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bank_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Address </FormLabel>
              <FormControl>
                <Input placeholder="Bank Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="iban"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Iban</FormLabel>
              <FormControl>
                <Input placeholder="Iban" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="swift_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Swift Code </FormLabel>
              <FormControl>
                <Input placeholder="Swift Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="">
          <FormLabel className="flex items-center gap-2 mb-2">
            Currency
          </FormLabel>
          <ComboboxForm
            data={currencyData}
            form={form}
            name="currency"
            formName="currency"
          />
        </div>
        <Button type="submit">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
