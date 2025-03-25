"use server";

import {
  UpdateUserSchema,
  UpdateUserSchemaType,
} from "@/app/types/update-user.type";
import {
  InviteUserSchema,
  InviteUserSchemaType,
  UserSchema,
  UserSchemaType,
} from "@/app/types/user.type";
import { createAdminClient } from "@/utils/supabase/server";

export async function createUser(formData: UserSchemaType) {
  const result = UserSchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createAdminClient();
  const { error } = await supabase.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    user_metadata: {
      name: formData.name,
      role: formData.role,
    },
    email_confirm: true, // This confirms the email without needing a timestamp
    role: "authenticated",
  });

  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(error.message);
  }
}

export async function deleteUser(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(id.toString());

  if (error) {
    console.log("Error deleting patient", error.message);
  }
}

export async function updateUser(formData: UpdateUserSchemaType) {
  const result = UpdateUserSchema.safeParse(formData);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  if (!formData?.id) {
    console.log("User ID is missing.");
    return;
  }

  const supabase = await createAdminClient();

  const updateData: {
    email: string;
    password?: string;
    user_metadata?: { name: string; role: string };
  } = {
    email: formData.email,
    user_metadata: { name: formData.name, role: formData.role },
  };

  if (formData.password && formData.password.length > 0) {
    updateData.password = formData.password;
  }

  const { data, error } = await supabase.auth.admin.updateUserById(
    formData.id,
    updateData
  );

  if (error) {
    throw new Error(`${error.message}`);
  } else {
  }

  return data;
}

export async function InviteNewUser(formData: InviteUserSchemaType) {
  const result = InviteUserSchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createAdminClient();
  const { error } = await supabase.auth.admin.inviteUserByEmail(formData.email); // Pass string directly

  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(error.message);
  }
}
