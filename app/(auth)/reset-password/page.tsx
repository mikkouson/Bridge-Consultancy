"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import ConfirmPasswordField from "@/components/confirmPassword";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import PasswordInput from "@/components/update-password";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ArrowRight, KeyRound, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { resetPassword } from "./actions";
import { ResetPasswordSchema } from "@/app/types/auth.type";

export default function ResetPassword() {
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof ResetPasswordSchema>) {
    try {
      await resetPassword(data);
      toast({ title: "Success", description: "Password reset successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 items-center">
        <Image src="/logo.png" width={200} height={200} alt="Logo" />
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                <KeyRound className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Reset Password</CardTitle>
              <CardDescription>
                Enter your new password below to reset your account password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid grid-cols-1 gap-4 mb-8 mt-4"
                >
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

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="group"
                  >
                    {isSubmitting ? (
                      <>
                        Resetting
                        <LoaderCircle
                          className="animate-spin ms-2"
                          size={16}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </>
                    ) : (
                      <>
                        Reset Password
                        <ArrowRight
                          className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                          size={16}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
