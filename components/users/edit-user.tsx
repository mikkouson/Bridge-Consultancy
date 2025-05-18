"use client";

import { updateUser } from "@/app/(admin)/users/actions";
import {
  UpdateUserSchema,
  UpdateUserSchemaType,
} from "@/app/types/update-user.type";
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
import ConfirmPasswordField from "../confirmPassword";
import PasswordInput from "../update-password";

export function EditUserForm({
  data = {},
  setOpen,
  action,
}: {
  data?: Partial<UpdateUserSchemaType>;
  setOpen: (open: boolean) => void;
  action?: "create" | "edit";
}) {
  const form = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      id: data?.id ?? "",
      name: data?.name ?? "",
      email: data?.email ?? "",
      role: data?.role ?? "",
    },
  });
  const { isSubmitting } = form.formState;
  async function onSubmit(data: z.infer<typeof UpdateUserSchema>) {
    try {
      if (action === "edit") {
        await updateUser(data);
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
              <FormLabel> Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
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
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role </FormLabel>
              <FormControl>
                <Input placeholder="Role" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <PasswordInput
              label="Password"
              {...field}
              value={field.value ?? ""}
              onChange={field.onChange}
              showStrengthMeter
            />
          )}
        />

        <ConfirmPasswordField
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm Password"
          disabled={(form.watch("password") || "").length < 7}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
