import { z } from "zod";

export const CompanySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name must be at least 1 character." }),
  representative: z.string().min(1, {
    message: "Representative must be at least 1 character.",
  }),
  email: z.string().email({ message: "Invalid email address." }),
  contact: z.string().min(10, {
    message: "Contact must be at least 10 characters.",
  }),
});

export type CompanySchemaType = z.infer<typeof CompanySchema>;
