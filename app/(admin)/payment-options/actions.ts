"use server";

import {
  PaymentOptionsSchemaType,
  PaymentOptionsSchema,
} from "@/app/types/payment-options.type";
import { createClient } from "@/utils/supabase/server";

export async function createPaymentOption(formData: PaymentOptionsSchemaType) {
  const result = PaymentOptionsSchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.from("payment_options").insert({
    bank_name: formData.bank_name,
    account_name: formData.account_name,
    iban: formData.iban,
    swift_code: formData.swift_code,
    bank_address: formData.bank_address,
  });

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}

export async function deletePaymentOption(id: number) {
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

export async function updatePaymentOption(formData: PaymentOptionsSchemaType) {
  const result = PaymentOptionsSchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payment_options")
    .update({
      bank_name: formData.bank_name,
      account_name: formData.account_name,
      iban: formData.iban,
      swift_code: formData.swift_code,
      bank_address: formData.bank_address,
    })
    .eq("id", formData.id);

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}
