"use client";

import { updateUser } from "@/app/(admin)/users/actions";
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
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "../ui/label";
import {
  UpdateUserSchema,
  UpdateUserSchemaType,
} from "@/app/types/update-user.type";
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
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);

  const toggleConfirmVisibility = () => setIsConfirmVisible((prev) => !prev);
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
        <PasswordInput form={form} name="password" label="Password" />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <FormControl>
                  <Input
                    id="confirmPassword"
                    disabled={(form.watch("password") || "").length < 7}
                    className="pe-9"
                    placeholder="Confirm Password"
                    type={isConfirmVisible ? "text" : "password"}
                    {...field}
                  />
                </FormControl>
                <button
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 ring-offset-background transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={toggleConfirmVisibility}
                  aria-label={
                    isConfirmVisible ? "Hide password" : "Show password"
                  }
                  aria-pressed={isConfirmVisible}
                >
                  {isConfirmVisible ? (
                    <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <Eye size={16} strokeWidth={2} aria-hidden="true" />
                  )}
                </button>
              </div>
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
