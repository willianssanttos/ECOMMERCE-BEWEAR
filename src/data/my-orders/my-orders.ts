import "server-only";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { orderTable } from "@/db/schema";

import { getSessionUser } from "../authentication/session";

export type OrderStatus = (typeof orderTable.$inferSelect)["status"];

export interface OrderItemDTO {
  id: string;
  imageUrl: string;
  productName: string;
  productVariantName: string;
  priceInCents: number;
  quantity: number;
}

export interface OrderDTO {
  id: string;
  totalPriceInCents: number;
  status: OrderStatus;
  createdAt: Date;
  items: OrderItemDTO[];
}

export const getOrders = async () => {
  const session = await getSessionUser();
  if (!session?.user.id) {
    redirect("/login");
  }
  const orders = await db.query.orderTable.findMany({
    where: eq(orderTable.userId, session.user.id),
    with: {
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
  return orders;
};
