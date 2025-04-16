import { z } from "zod";

export const CustomerSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name must be at least 1 character." }),
  email: z.string().email({ message: "Invalid email address." }),
  contact: z.string().min(10, {
    message: "Contact must be at least 10 characters.",
  }),
  type: z.string().min(1, { message: "Type is required" }),
  deleted_at: z.string().optional(),
});

export type CustomerSchemaType = z.infer<typeof CustomerSchema>;
