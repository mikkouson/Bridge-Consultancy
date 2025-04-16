"use server";

import { CustomerSchema, CustomerSchemaType } from "@/app/types/companies.type";
import { createClient } from "@/utils/supabase/server";

export async function createNewCustomer(formData: CustomerSchemaType) {
  const result = CustomerSchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.from("companies").insert({
    name: formData.name,
    company_name: formData.company_name,
    email: formData.email,
    contact: formData.contact,
  });

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}

export async function deleteCustomer(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("companies")
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  } else {
    return true;
  }
}

export async function updateCustomer(
  formData: CustomerSchemaType
): Promise<void> {
  const result = CustomerSchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("companies")
    .update({
      name: formData.name,
      company_name: formData.company_name,
      email: formData.email,
      contact: formData.contact,
    })
    .eq("id", formData.id);

  if (error) {
    throw new Error(error.message);
  }
}
