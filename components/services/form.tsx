"use client";

import { createService, updateService } from "@/app/(admin)/services/actions";
import { ServicesSchema, ServicesSchemaType } from "@/app/types/services.type";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Switch } from "../ui/switch";
import { useId } from "react";

export function ServiceForm({
  data = {},
  setOpen,
  action,
}: {
  data?: Partial<ServicesSchemaType>;
  setOpen: (open: boolean) => void;
  action?: "create" | "edit";
}) {
  const id = useId();
  const form = useForm<z.infer<typeof ServicesSchema>>({
    resolver: zodResolver(ServicesSchema),
    defaultValues: {
      id: data?.id ?? 0,
      name: data?.name ?? "",
      description: data?.description ?? "",
      amount: data?.amount ?? 0,
      vat: data.vat ?? false,
      vat_amount: data.vat_amount ?? 0,
    },
  });
  const { isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof ServicesSchema>) {
    try {
      if (action === "edit") {
        await updateService(data);
      } else {
        await createService(data);
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8 mt-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input placeholder="Service Name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount </FormLabel>
              <FormControl>
                <Input
                  placeholder="Amount"
                  {...field}
                  type="number"
                  onChange={(e) =>
                    field.onChange(e.target.value ? Number(e.target.value) : "")
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vat"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Vat</FormLabel>
                <FormDescription>
                  Enable or disable VAT for this service.
                </FormDescription>
              </div>
              <FormControl>
                <div>
                  <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
                    <Switch
                      id={id}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="peer data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto rounded-md [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-sm [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
                    />
                    <span className="min-w-78flex pointer-events-none relative ms-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full">
                      <span className="text-[10px] font-medium uppercase">
                        Off
                      </span>
                    </span>
                    <span className="min-w-78flex peer-data-[state=checked]:text-background pointer-events-none relative me-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full">
                      <span className="text-[10px] font-medium uppercase">
                        On
                      </span>
                    </span>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
