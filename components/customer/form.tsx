"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  createNewCustomer,
  updateCustomer,
} from "@/app/(admin)/customers/actions";
import { CustomerSchema, CustomerSchemaType } from "@/app/types/companies.type";
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
import { CheckCircle, CircleAlert } from "lucide-react";
import { Separator } from "../ui/separator";

export function CustomerForm({
  data = {},
  setOpen,
  action,
}: {
  data?: Partial<CustomerSchemaType>;
  setOpen: (open: boolean) => void;
  action?: "create" | "edit";
}) {
  const form = useForm<z.infer<typeof CustomerSchema>>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      id: data?.id ?? 0,
      name: data?.name ?? "",
      company_name: data?.company_name ?? "",
      email: data?.email ?? "",
      contact: data?.contact ?? "",
    },
  });
  const { isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof CustomerSchema>) {
    try {
      if (action === "edit") {
        await updateCustomer(data);
      } else {
        await createNewCustomer(data);
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
      setOpen(false);
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8 mt-4"
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormLabel>Customer Id</FormLabel>
              <FormControl>
                <Input placeholder="Customer Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input placeholder="Customer Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact </FormLabel>
              <FormControl>
                <Input placeholder="Contact" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="my-2" />

        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Company Name{" "}
                <span className=" text-muted-foreground">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Company Name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
