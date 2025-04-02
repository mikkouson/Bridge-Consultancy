import { coerce, z } from "zod";

export const InvoicesSchema = z.object({
  id: z.number().optional(),
  deleted_at: z.string().nullable().optional(),
  company: z.number().min(1, { message: "Company is required." }),
  invoice_number: z.string().min(1, { message: "Invoice number is required." }),
  date: z.coerce.date(),
  vat: z.number().nonnegative(),
  amount: z.number().nonnegative(),
  total_amount: z.number().nonnegative(),
  payment_option: z.number().min(1, { message: "Payment option is required." }),
  services: z
    .array(
      z.object({
        invoice_service_id: z.string().optional(),
        invoice_id: z.string().optional(),
        vat: z.boolean(),
        service_date: coerce.date(),
        service_name: z.string(),
        amount: z.number().nonnegative(),
      })
    )
    .min(1, { message: "At least one service is required." }),
});

export type InvoicesSchemaType = z.infer<typeof InvoicesSchema>;
