import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { paymentTable } from "@/db/schema";

export interface PaymentDTO {
  id: string;
  orderId: string;
  stripePaymentIntentId: string;
  stripeChargeId: string | null;
  amountInCents: number;
  method: string;
  status: "pending" | "paid" | "failed" | "refunded";
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const getPaymentByOrderId = async (
  orderId: string,
): Promise<PaymentDTO> => {
  const payment = await db.query.paymentTable.findFirst({
    where: eq(paymentTable.orderId, orderId),
  });
  return payment as PaymentDTO;
};
