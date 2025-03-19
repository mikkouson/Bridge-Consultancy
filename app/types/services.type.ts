import { z } from "zod";

export const ServicesSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name must be at least 1 character." }),
  subject: z.string().min(1, {
    message: "Subject must be at least 1 character.",
  }),
  amount: z.number().min(1, {
    message: "Amount must be at least 1 characters.",
  }),
  deleted_at: z.string().optional(),
});

export type ServicesSchemaType = z.infer<typeof ServicesSchema>;
