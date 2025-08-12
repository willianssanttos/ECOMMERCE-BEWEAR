"use server";

import { desc } from "drizzle-orm";
import { headers } from "next/headers";
import { toast } from "sonner";

import { db } from "@/db";
import { auth } from "@/lib/auth";

export const getShippingAddresses = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("Unaunthorized");
  }

  try {
    const addresses = await db.query.shippingAddressTable.findMany({
      where: (address, { eq }) => eq(address.userId, session.user.id),
      orderBy: (address) => desc(address.createdAt),
    });

    return addresses;
  } catch (error) {
    toast.error("Erro ao buscar endereços:");
    throw new Error("Erro ao buscar endereços");
  }
};
