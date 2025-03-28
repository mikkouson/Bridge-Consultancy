"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import {
  ForgotPasswordSchema,
  ForgotPasswordSchemaType,
} from "../types/auth.type";

export async function resetPassword(
  formData: ForgotPasswordSchemaType
): Promise<void> {
  const result = ForgotPasswordSchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  // Call the RPC function to check if the user exists
  const { data: user, error: userError } = await supabase.rpc(
    "check_user_exists",
    { email: formData.email }
  );

  if (userError) {
    throw new Error(`Error checking user: ${userError.message}`);
  }

  if (!user || user.length === 0) {
    throw new Error("No account found with this email.");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    throw new Error(`Reset password failed: ${error.message}`);
  }
}
