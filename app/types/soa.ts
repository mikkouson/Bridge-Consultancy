import { z } from "zod";

export const StatementEntrySchema = z.object({
  entry_date: z.coerce.date(),
  transaction_type: z.enum(["Invoice", "Payment Received"]),
  reference: z.string(),
  amount: z.number().default(0),
  payment: z.number().default(0),
  balance: z.number(),
  currency: z.string().default("AED"),
  invoice_id: z.number().optional(),
  payment_id: z.number().optional(),
});

export const SoaSchema = z.object({
  id: z.number().optional(),
  company_id: z.number().optional(),
  statement_number: z.string().min(1, "Statement number is required"),
  statement_date: z.coerce.date({
    required_error: "Statement date is required",
    invalid_type_error: "Please select a valid date",
  }),
  opening_balance_date: z.coerce.date({
    required_error: "Opening balance date is required",
    invalid_type_error: "Please select a valid date",
  }),
  opening_balance: z.number({
    required_error: "Opening balance is required",
    invalid_type_error: "Please enter a valid number",
  }),
  currency: z.string().default("AED"),
  statement_entries: z.array(StatementEntrySchema).default([]),
  deleted_at: z.string().optional(),
});

export type SoaSchemaType = z.infer<typeof SoaSchema>;
export type StatementEntryType = z.infer<typeof StatementEntrySchema>;
