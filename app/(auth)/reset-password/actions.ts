"use server";

import {
  ResetPasswordSchema,
  ResetPasswordSchemaType,
} from "@/app/types/auth.type";
import { createClient } from "@/utils/supabase/server";

export async function resetPassword(
  formData: ResetPasswordSchemaType
): Promise<void> {
  const result = ResetPasswordSchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: formData.password,
  });

  if (error) {
    throw new Error(`Reset password failed: ${error.message}`);
  }
}
