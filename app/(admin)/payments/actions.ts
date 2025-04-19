"use server";

import { PaymentsSchemaType, PaymentsSchema } from "@/app/types/payments";
import { createClient } from "@/utils/supabase/server";

export async function createPayment(formData: PaymentsSchemaType) {
  const result = PaymentsSchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.from("payments").insert({
    invoice_id: formData.invoice_id,
    amount: formData.amount,
    date: formData.date,
    payment_method: formData.payment_method,
    comment: formData.comment,
  });

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}

export async function deletePayment(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("payment_options")
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

export async function updatePayment(formData: PaymentsSchemaType) {
  const result = PaymentsSchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payment_options")
    .update({
      invoice_id: formData.invoice_id,
      amount: formData.amount,
      date: formData.date,
      payment_method: formData.payment_method,
      comment: formData.comment,
    })
    .eq("id", formData.id);

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}
