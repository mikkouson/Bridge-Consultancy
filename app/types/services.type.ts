import { z } from "zod";

export const ServicesSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name must be at least 1 character." }),
  // description: z.string().min(1, {
  //   message: "Description must be at least 1 character.",
  // }),
  amount: z.number().min(1, {
    message: "Amount must be at least 1 characters.",
  }),
  vat_amount: z.number().optional(),
  deleted_at: z.string().optional(),
});

export type ServicesSchemaType = z.infer<typeof ServicesSchema>;
