"use server";

import { ServicesSchema, ServicesSchemaType } from "@/app/types/services.type";
import { createClient } from "@/utils/supabase/server";

export async function createService(formData: ServicesSchemaType) {
  const result = ServicesSchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.from("services").insert({
    name: formData.name,
    description: formData.description,
    amount: formData.amount,
    vat: formData.vat,
  });

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}

export async function deleteService(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("services")
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

export async function updateService(formData: ServicesSchemaType) {
  const result = ServicesSchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .update({
      name: formData.name,
      description: formData.description,
      amount: formData.amount,
      vat: formData.vat,
    })
    .eq("id", formData.id);

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}
