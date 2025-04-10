import { z } from "zod";

export const InvoicesSchema = z.object({
  id: z.number().optional(),
  deleted_at: z.string().nullable().optional(),
  company: z.number().min(1, { message: "Company is required." }),
  companies: z
    .object({
      name: z.string(),
    })
    .optional(), // mark as optional if not always included
  invoice_number: z.string().min(1, { message: "Invoice number is required." }),
  date: z.coerce.date(),
  amount: z.number().nonnegative().optional(),
  total_amount: z.number().nonnegative().optional(),

  total_vat_amount: z.number().nonnegative().optional(),
  payment_option: z.number().min(1, { message: "Payment option is required." }),
  currency: z.string().min(1, { message: "currency is required" }),
  currency_value: z.number().min(1, { message: "currency is required" }),
  services: z
    .array(
      z.object({
        id: z.number().optional(),
        service_id: z.number().optional(),
        invoice_service_id: z.number().optional(),
        invoice_id: z.number().optional(),
        service_vat: z.boolean(),
        service_vat_amount: z.number(),
        service_date: z.coerce.date(),
        service_name: z.string(),
        amount: z.number().nonnegative(),
        service_deleted_at: z.coerce.date().optional(),
      })
    )
    .min(1, { message: "At least one service is required." }),
});

export type InvoicesSchemaType = z.infer<typeof InvoicesSchema>;
export type ServiceType = InvoicesSchemaType["services"];
