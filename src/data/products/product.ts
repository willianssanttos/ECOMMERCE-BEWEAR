import "server-only";

import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";

export interface ProductDTO {
  id: string;
  name: string;
  description?: string | null;
  categoryId?: string | null;
  variants?: ProductVariantDTO[];
}

export interface ProductVariantDTO {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  priceInCents: number;
  product?: ProductDTO;
}

export const getProducts = async (): Promise<ProductDTO[]> => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  return products as ProductDTO[];
};

export const getNewlyCreatedProducts = async (): Promise<ProductDTO[]> => {
  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });

  return newlyCreatedProducts as ProductDTO[];
};

export const getProductVariant = async (
  slug: string,
): Promise<ProductVariantDTO> => {
  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
    },
  });
  if (!productVariant) {
    return notFound();
  }
  return productVariant as ProductVariantDTO;
};

export const getLikelyProducts = async (
  categoryId?: string,
): Promise<ProductDTO[]> => {
  if (!categoryId) return [];
  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, categoryId),
    with: {
      variants: true,
    },
  });
  return likelyProducts as ProductDTO[];
};
