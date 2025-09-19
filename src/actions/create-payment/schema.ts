import z from "zod";

export const createPaymentSchema = z.object({
  orderId: z.uuid(),
  stripePaymentIntentId: z.string(),
  stripeChargeId: z.string().optional(),
  amountInCents: z.number().int().positive(),
  method: z.string(),
  status: z.enum(["pending", "paid", "failed", "refunded"]),
  paidAt: z.date().optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;