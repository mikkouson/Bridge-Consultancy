"use server";

import { CompanySchema, CompanySchemaType } from "@/app/types/companies.type";
import { createClient } from "@/utils/supabase/server";

export async function createNewCompany(formData: CompanySchemaType) {
  const result = CompanySchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.from("companies").insert({
    name: formData.name,
    representative: formData.representative,
    email: formData.email,
    contact: formData.contact,
  });

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}

export async function deleteCompanies(id: number) {
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
