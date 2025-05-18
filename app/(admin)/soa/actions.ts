"use server";

import { SoaSchema, SoaSchemaType, StatementEntryType } from "@/app/types/soa";
import { createClient } from "@/utils/supabase/server";

export async function createSOA(formData: SoaSchemaType) {
  const result = SoaSchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createClient();

  // First validate that we can insert all entries
  const entriesToInsert = formData.statement_entries.map((entry) => ({
    date: entry.date,
    transaction_type: entry.transaction_type,
    reference: entry.reference,
    amount: entry.amount,
    payment: entry.payment,
    balance: entry.balance,
    currency: entry.currency,
    invoice_id: entry.invoice_id,
  }));

  // Create the statement first
  const { data: statementData, error: statementError } = await supabase
    .from("statements")
    .insert({
      company_id: formData.company,
      statement_number: formData.statement_number,
      statement_date: formData.statement_date,
      opening_balance_date: formData.opening_balance_date,
      opening_balance: formData.opening_balance,
      currency: formData.currency,
      payment_option: formData.payment_option?.id,
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

// export async function updateSOA(formData: SoaSchemaType) {
//   const result = SoaSchema.safeParse(formData);

//   if (!result.success) {
//     throw new Error("Invalid form data");
//   }

//   const supabase = await createClient();

//   // Update the statement data
//   const { data: statementData, error: statementError } = await supabase
//     .from("statements")
//     .update({
//       company_id: formData.company_id,
//       statement_number: formData.statement_number,
//       statement_date: formData.statement_date,
//       opening_balance_date: formData.opening_balance_date,
//       opening_balance: formData.opening_balance,
//       currency: formData.currency,
//     })
//     .eq("id", formData.id)
//     .select()
//     .single();

//   if (statementError) {
//     throw new Error(statementError.message);
//   }

//   if (!statementData) {
//     throw new Error("Failed to update statement");
//   }

//   // Handle statement entries
//   try {
//     const existingEntries = await supabase
//       .from("statement_entries")
//       .select("id")
//       .eq("statement_id", formData.id);

//     const existingEntryIds =
//       existingEntries.data?.map((entry) => entry.id) || [];
//     const newEntryIds = formData.statement_entries.map((entry) => entry.id);

//     // Soft delete entries not in the new list
//     const entriesToDelete = existingEntryIds.filter(
//       (id) => !newEntryIds.includes(id)
//     );

//     if (entriesToDelete.length) {
//       await supabase
//         .from("statement_entries")
//         .update({ deleted_at: new Date().toISOString() })
//         .in("id", entriesToDelete);
//     }

//     // Insert or update entries
//     for (const entry of formData.statement_entries) {
//       if (entry.id) {
//         await supabase
//           .from("statement_entries")
//           .update({
//             date: entry.entry_date,
//             transaction_type: entry.transaction_type,
//             reference: entry.reference,
//             amount: entry.amount,
//             payment: entry.payment,
//             balance: entry.balance,
//             currency: entry.currency,
//             invoice_id: entry.invoice_id,
//             payment_id: entry.payment_id,
//           })
//           .eq("id", entry.id);
//       } else {
//         await supabase.from("statement_entries").insert({
//           statement_id: formData.id,
//           date: entry.entry_date,
//           transaction_type: entry.transaction_type,
//           reference: entry.reference,
//           amount: entry.amount,
//           payment: entry.payment,
//           balance: entry.balance,
//           currency: entry.currency,
//           invoice_id: entry.invoice_id,
//           payment_id: entry.payment_id,
//         });
//       }
//     }
//   } catch (error) {
//     throw new Error(`Error updating statement entries: ${error.message}`);
//   }
// }
export async function deleteStatment(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("statements")
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
