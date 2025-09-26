"use server";

import { and, eq, lt } from "drizzle-orm";

import { db } from "@/db";
import { orderTable, paymentTable } from "@/db/schema";

export async function monitorPendingPayments() {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 5 * 60 * 1000);

  // Busca pedidos pendentes há mais de 24h
  const pendingOrders = await db
    .select()
    .from(orderTable)
    .where(
      and(
        eq(orderTable.status, "pending"),
        lt(orderTable.createdAt, twentyFourHoursAgo),
      ),
    );

  for (const order of pendingOrders) {
    await db
      .update(orderTable)
      .set({ status: "canceled" })
      .where(eq(orderTable.id, order.id));

    await db
      .update(paymentTable)
      .set({ status: "failed" })
      .where(eq(paymentTable.orderId, order.id));
  }

  return { canceledOrders: pendingOrders.map((o) => o.id) };
}
