"use server";

import { SoaSchema, SoaSchemaType } from "@/app/types/soa";
import { createClient } from "@/utils/supabase/server";

export async function CreateSOA(formData: SoaSchemaType) {
  const result = SoaSchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createClient();

  // First validate that we can insert all entries
  const entriesToInsert = formData.statement_entries.map((entry) => ({
    date: entry.entry_date,
    transaction_type: entry.transaction_type,
    reference: entry.reference,
    amount: entry.amount,
    payment: entry.payment,
    balance: entry.balance,
    currency: entry.currency,
    invoice_id: entry.invoice_id,
    payment_id: entry.payment_id,
  }));

  // Create the statement first
  const { data: statementData, error: statementError } = await supabase
    .from("statements")
    .insert({
      company_id: formData.company_id,
      statement_number: formData.statement_number,
      statement_date: formData.statement_date,
      opening_balance_date: formData.opening_balance_date,
      opening_balance: formData.opening_balance,
      currency: formData.currency,
    })
    .select()
    .single();

  if (statementError) {
    throw new Error(statementError.message);
  }

  if (!statementData) {
    throw new Error("Failed to create Statement");
  }

  try {
    // Now insert the entries
    const { error: statementEntriesError } = await supabase
      .from("statement_entries")
      .insert(
        entriesToInsert.map((entry) => ({
          ...entry,
          statement_id: statementData.id,
        }))
      );

    if (statementEntriesError) {
      // If entries insertion fails, delete the statement
      await supabase.from("statements").delete().eq("id", statementData.id);
      throw new Error(statementEntriesError.message);
    }
  } catch (error) {
    // If any error occurs during entries insertion, delete the statement
    await supabase.from("statements").delete().eq("id", statementData.id);
    throw error;
  }
}
