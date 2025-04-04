"use server";

import { InvoicesSchemaType, InvoicesSchema } from "@/app/types/invoices.type";
import { createClient } from "@/utils/supabase/server";

export async function createInvoice(formData: InvoicesSchemaType) {
  const result = InvoicesSchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.from("invoices").insert({
    company: formData.company,
    invoice_number: formData.invoice_number,
    date: formData.date,
    vat: formData.vat,
    payment_option: formData.payment_option,
  });

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}

export async function deleteInvoice(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("invoices")
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

export async function updateInvoice(formData: InvoicesSchemaType) {
  const result = InvoicesSchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .update({
      company: formData.company,
      invoice_number: formData.invoice_number,
      date: formData.date,
      vat: formData.vat,
      payment_option: formData.payment_option,
    })
    .eq("id", formData.id);

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}
