import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { orderTable, paymentTable } from "@/db/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

function getMethod(session: Stripe.Checkout.Session) {
  return session.payment_method_types?.[0] ?? "unknown";
}

async function fetchLatestChargeId(paymentIntentId: string | null) {
  if (!paymentIntentId) return null;
  const pi = (await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ["latest_charge"],
  })) as Stripe.PaymentIntent;
  const latestCharge = pi.latest_charge;
  return typeof latestCharge === "string" ? latestCharge : latestCharge?.id ?? null;
}

async function insertPayment(opts: {
  orderId: string;
  paymentIntentId: string | null;
  stripeChargeId: string | null;
  amountInCents: number;
  method: string;
  status: "paid" | "pending" | "failed";
  paidAt: Date | null;
}) {
  await db.insert(paymentTable).values({
    orderId: opts.orderId,
    stripePaymentIntentId: opts.paymentIntentId ?? "unknown",
    stripeChargeId: opts.stripeChargeId,
    amountInCents: opts.amountInCents,
    method: opts.method,
    status: opts.status,
    paidAt: opts.paidAt,
  });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) return NextResponse.error();

  const paymentIntentId = (session.payment_intent as string) ?? null;
  const amountInCents = session.amount_total ?? 0;
  const method = getMethod(session);

  if (session.payment_status === "paid") {
    const stripeChargeId = await fetchLatestChargeId(paymentIntentId);

    await db.update(orderTable).set({ status: "paid" }).where(eq(orderTable.id, orderId));

    await insertPayment({
      orderId,
      paymentIntentId,
      stripeChargeId,
      amountInCents,
      method,
      status: "paid",
      paidAt: session.created ? new Date(session.created * 1000) : null,
    });

    return NextResponse.json({ received: true });
  }

  // Qualquer outro status no completed fica como pendente
  await db.update(orderTable).set({ status: "pending" }).where(eq(orderTable.id, orderId));

  await insertPayment({
    orderId,
    paymentIntentId,
    stripeChargeId: null,
    amountInCents,
    method,
    status: "pending",
    paidAt: null,
  });

  return NextResponse.json({ received: true });
}

async function handleCheckoutFailedOrExpired(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) return NextResponse.error();

  await db.update(orderTable).set({ status: "canceled" }).where(eq(orderTable.id, orderId));

  const paymentIntentId =
    typeof session.payment_intent === "string" && session.payment_intent
      ? session.payment_intent
      : "unknown";

  await insertPayment({
    orderId,
    paymentIntentId,
    stripeChargeId: null,
    amountInCents: session.amount_total ?? 0,
    method: getMethod(session),
    status: "failed",
    paidAt: null,
  });

  return NextResponse.json({ received: true });
}

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.error();
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.error();

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.error();
  }

  switch (event.type) {
    case "checkout.session.completed":
      return handleCheckoutCompleted(event.data.object);

    case "checkout.session.expired":
    case "checkout.session.async_payment_failed":
      return handleCheckoutFailedOrExpired(event.data.object);

    default:
      // Eventos não tratados explicitamente
      return NextResponse.json({ ignored: true });
  }
};
