import { z } from "zod";

export const InvoicesSchema = z.object({
  id: z.number().optional(),
  deleted_at: z.string().nullable().optional(),
  company: z.number().min(1, { message: "Company is required." }),
  status: z.string().optional(),
  companies: z
    .object({
      id: z.string().optional(),
      name: z.string(),
      company_name: z.string(),
      email: z.string(),
      contact: z.string().optional(),
    })
    .optional(), // mark as optional if not always included
  invoice_number: z.string().refine((val) => val.toString().length === 9, {
    message: "Invoice Number must be exactly 9 digits long.",
  }),
  trn: z.number().refine((val) => val.toString().length === 15, {
    message: "TRN must be exactly 15 digits long.",
  }),
  paid: z.number().optional(),
  balance: z.number().optional(),

  date: z.coerce.date(),
  payment_option: z.number().min(1, { message: "Payment option is required." }),
  currency: z.string().min(1, { message: "Currency is required" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  invoice_type: z.string().min(1, { message: "Invoice Type is required" }),
  amount: z.number().optional(),
  total_vat_amount: z.number().optional(),
  total_amount: z.number().optional(),
  exchange_rate: z
    .number()
    .min(0.01, { message: "Exchange rate must be greater than 0" }),

  payment_options: z
    .object({
      account_name: z.string(),
      currency: z.string(),
      bank_name: z.string(),
      iban: z.string(),
      swift_code: z.string(),
      bank_address: z.string().optional(),
    })
    .optional(),

  invoice_services: z
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
        amount: z.number().optional(),
        service_deleted_at: z.coerce.date().optional(),
        currency: z.string().optional(),
        exchange_rate: z.number().optional(),
        base_amount: z.number().optional(),
        deleted_at: z.date().optional(),
      })
    )
    .optional(),

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
        amount: z.number().optional(),
        service_deleted_at: z.coerce.date().optional(),
        currency: z.string().optional(),
        exchange_rate: z.number().optional(),
        base_amount: z.number().optional(),
        deleted_at: z.date().optional(),
      })
    )
    .min(1, { message: "At least one service is required." }),
});

export type InvoicesSchemaType = z.infer<typeof InvoicesSchema>;
export type ServiceType = InvoicesSchemaType["services"];
