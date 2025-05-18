import { z } from "zod";

export const StatementEntrySchema = z.object({
  id: z.number().optional(),
  date: z.coerce.date(),
  transaction_type: z.enum(["Invoice", "Payment Received"]),
  reference: z.string(),
  amount: z.number().optional(),
  payment: z.number().optional(),
  balance: z.number(),
  currency: z.string().optional(),
  invoice_id: z.number().optional(),
  payment_id: z.number().optional(),
  deleted_at: z.string().nullable().optional(),
});
export const PaymentOptionSchema = z.object({
  id: z.number().min(1, "Statement number is required"),
  iban: z.string().optional(),
  currency: z.string().optional(),
  bank_name: z.string().optional(),
  deleted_at: z.string().nullable().optional(),
  swift_code: z.string().optional(),
  account_name: z.string().optional(),
  bank_address: z.string().optional(),
});

export const CompanySchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  balance: z.number().optional(),
  contact: z.string().optional(),
  deleted_at: z.string().nullable().optional(),
  company_name: z.string().optional(),
});

export const PaymentSchema = z.object({
  id: z.number().optional(),
  date: z.string().optional(),
  amount: z.number().optional(),
  comment: z.string().optional(),
  created_at: z.string().optional(),
  deleted_at: z.string().nullable().optional(),
  invoice_id: z.number().optional(),
  payment_method: z.string().optional(),
});

export const SoaSchema = z.object({
  id: z.number().optional(),
  company: z.number(), // company_id can be either a number or an object with id
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
  currency: z.string().optional(),
  statement_entries: z.array(StatementEntrySchema, {
    required_error: "Statement entries are required",
  }),
  payment_option: PaymentOptionSchema.optional(),
  company_id: CompanySchema.optional(),
  total_paid: z.number().optional(),
  amount_due: z.number().optional(),
  created_at: z.string().optional(),
});

export type PaymentOptionType = z.infer<typeof PaymentOptionSchema>;
export type CompanyType = z.infer<typeof CompanySchema>;
export type PaymentType = z.infer<typeof PaymentSchema>;
export type StatementEntryType = z.infer<typeof StatementEntrySchema>;
export type SoaSchemaType = z.infer<typeof SoaSchema>;
