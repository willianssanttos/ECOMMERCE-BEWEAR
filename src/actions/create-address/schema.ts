import z from "zod";

export const createShippingAddressSchema = z.object({
  email: z.email(),
  fullName: z.string().min(1),
  cpf: z.string().min(1),
  phone: z.string().min(1),
  cep: z.string().min(1),
  address: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional().or(z.literal("")),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
});

export type createShippingAddressSchema = z.infer<typeof createShippingAddressSchema>;
