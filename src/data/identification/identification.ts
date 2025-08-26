import "server-only";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";

import { getSessionUser } from "../authentication/session";

export interface ShippingAddressDTO {
  id: string;
  userId: string;
  recipientName: string;
  street: string;
  number: string;
  complement: string | null;
  city: string;
  state: string;
  neighborhood: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  cpfOrCnpj: string;
  createdAt: Date;
}

export interface IdentificationDTO {
  cartId: string;
  userId: string;
  createdAt: Date;
  shippingAddress: ShippingAddressDTO | null;
  items: Array<{
    id: string;
    quantity: number;
    productVariant: {
      id: string;
      name: string;
      priceInCents: number;
      imageUrl: string;
      product: {
        id: string;
        name: string;
      };
    };
  }>;
}

export const getIdentification =
  async (): Promise<IdentificationDTO | null> => {
    const session = await getSessionUser();
    if (!session?.user.id) {
      redirect("/");
    }

    const cart = await db.query.cartTable.findFirst({
      where: (cart, { eq }) => eq(cart.userId, session.user.id),
      with: {
        shippingAddress: true,
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
    
  if (!cart) return null;

  return {
    cartId: cart.id,
    userId: cart.userId,
    createdAt: cart.createdAt,
    shippingAddress: cart.shippingAddress
      ? {
          id: cart.shippingAddress.id,
          userId: cart.shippingAddress.userId,
          recipientName: cart.shippingAddress.recipientName,
          street: cart.shippingAddress.street,
          number: cart.shippingAddress.number,
          complement: cart.shippingAddress.complement,
          city: cart.shippingAddress.city,
          state: cart.shippingAddress.state,
          neighborhood: cart.shippingAddress.neighborhood,
          zipCode: cart.shippingAddress.zipCode,
          country: cart.shippingAddress.country,
          phone: cart.shippingAddress.phone,
          email: cart.shippingAddress.email,
          cpfOrCnpj: cart.shippingAddress.cpfOrCnpj,
          createdAt: cart.shippingAddress.createdAt,
        }
      : null,
    items: cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      productVariant: {
        id: item.productVariant.id,
        name: item.productVariant.name,
        priceInCents: item.productVariant.priceInCents,
        imageUrl: item.productVariant.imageUrl,
        product: {
          id: item.productVariant.product.id,
          name: item.productVariant.product.name,
        },
      },
    })),
  };
};

export const getShippingAddresses = async (): Promise<ShippingAddressDTO[]> => {
  const session = await getSessionUser();
  if (!session?.user.id) {
    redirect("/");
  }

  const shippingAddresses = await db.query.shippingAddressTable.findMany({
    where: eq(shippingAddressTable.userId, session.user.id),
  });

  return shippingAddresses as ShippingAddressDTO[];
};
