import z from "zod";

export const removeAddressSchema = z.object({
    addressId: z.uuid(),
});

export type removeAddressSchema = z.infer<typeof removeAddressSchema>;