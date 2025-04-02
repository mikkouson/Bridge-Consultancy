import { z } from "zod";

export const PaymentOptionsSchema = z.object({
  id: z.number().optional(),
  bank_name: z
    .string()
    .min(1, { message: "Bank Name must be at least 1 character." }),
  account_name: z
    .string()
    .min(1, { message: "Bank Name must be at least 1 character." }),
  iban: z.string().min(21, { message: "Iban must be at least 21 character." }),
  swift_code: z
    .string()
    .min(8, { message: "Swift/BIC Code must be at least 8 character." }),
  bank_address: z
    .string()
    .min(1, { message: "Bank Address must be at least 1 character." }),
  deleted_at: z.string().optional(),
});

export type PaymentOptionsSchemaType = z.infer<typeof PaymentOptionsSchema>;
