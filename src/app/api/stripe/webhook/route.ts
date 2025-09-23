import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { orderTable, paymentTable } from "@/db/schema";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.error();
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.error();
  }
  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      return NextResponse.error();
    }
    await db
      .update(orderTable)
      .set({
        status: "paid",
      })
      .where(eq(orderTable.id, orderId));

    await db.insert(paymentTable).values({
      orderId,
      stripePaymentIntentId: session.payment_intent as string,
      amountInCents: session.amount_total ?? 0,
      method: session.payment_method_types[0] ?? "unknown",
      status: session.payment_status === "paid" ? "paid" : "pending",
      paidAt: session.created ? new Date(session.created * 1000) : null,
    });
  }

  if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed"
  ) {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      return NextResponse.error();
    }
    await db
      .update(orderTable)
      .set({
        status: "canceled",
      })
      .where(eq(orderTable.id, orderId));

    await db.insert(paymentTable).values({
      orderId,
      stripePaymentIntentId: session.payment_intent as string,
      amountInCents: session.amount_total ?? 0,
      method: session.payment_method_types[0] ?? "unknown",
      status: "failed",
      paidAt: null,
    });
  }
  return NextResponse.json({ received: true });
};
