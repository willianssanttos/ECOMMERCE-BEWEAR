import "server-only";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { orderTable } from "@/db/schema";

import { getSessionUser } from "../authentication/session";
import { PaymentDTO } from "../payment/payment";

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
  orderNumber: string;
  totalPriceInCents: number;
  status: OrderStatus;
  createdAt: Date;
  items: OrderItemDTO[];
  recipientName: string;
  street: string;
  number: string;
  complement?: string | null;
  city: string;
  state: string;
  neighborhood: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  cpfOrCnpj: string;
  payment: PaymentDTO | null;
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
      shippingAddress: true,
      payment: true,
    },
  });
  return orders;
};