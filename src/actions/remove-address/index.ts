"use server";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { orderTable, shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { removeAddressSchema } from "./schema";

export const removeAddress = async (data: removeAddressSchema) => {
  removeAddressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unaunthorized");
  }

  const orderWithAddress = await db.query.orderTable.findFirst({
    where: (order, { eq }) =>
      eq(order.shippingAddressId, data.addressId) &&
      eq(order.userId, session.user.id),
  });
  if (orderWithAddress) {
    await db
      .update(orderTable)
      .set({ shippingAddressId: data.addressId })
      .where(eq(orderTable.id, orderWithAddress.id));
  }

  await db
    .delete(shippingAddressTable)
    .where(
      and(
        eq(shippingAddressTable.id, data.addressId),
        eq(shippingAddressTable.userId, session.user.id),
      ),
    );

  return { success: true };
};
