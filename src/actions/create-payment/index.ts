"use server";

import { db } from "@/db";
import { paymentTable } from "@/db/schema";

import { CreatePaymentInput, createPaymentSchema } from "./schema";

export const createPayment = async (input: CreatePaymentInput) => {
  createPaymentSchema.parse(input);

  const [payment] = await db
    .insert(paymentTable)
    .values({
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return payment;
};
