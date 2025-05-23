"use client";

import { createService, updateService } from "@/app/(admin)/services/actions";
import { ServicesSchema, ServicesSchemaType } from "@/app/types/services.type";
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
import { CheckCircle, CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function ServiceForm({
  data = {},
  setOpen,
  action,
}: {
  data?: Partial<ServicesSchemaType>;
  setOpen: (open: boolean) => void;
  action?: "create" | "edit";
}) {
  const form = useForm<z.infer<typeof ServicesSchema>>({
    resolver: zodResolver(ServicesSchema),
    defaultValues: {
      id: data?.id ?? 0,
      name: data?.name ?? "",
      // description: data?.description ?? "",
      amount: data?.amount ?? 0,
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
        {/* <FormField
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
        /> */}

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
        <Button type="submit">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
