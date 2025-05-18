import { z } from "zod";

export const PaymentsSchema = z.object({
  id: z.number().optional(),
  invoice_id: z.number().optional(),
  currency: z.string().optional(),
  amount: z.number().min(1, {
    message: "Amount must be at least 1 characters.",
  }),
  date: z.coerce.date(),
  payment_method: z.string().min(1, { message: "Company is required." }),
  comment: z.string().optional(),
  deleted_at: z.string().optional(),
  invoices: z
    .object({
      invoice_number: z.string().optional(),
      currency: z.string().optional(),
    })
    .optional(),
});

export type PaymentsSchemaType = z.infer<typeof PaymentsSchema>;
