import "server-only";

import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";

// implementar os dtos, para desaclopação dos retornos dos dados retornado do drizzle com a UI
//interface Products {}

interface ProductVariantProps {
  params: Promise<{ slug: string }>;
}

export const getProducts = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  return products;
};

export const getNewlyCreatedProducts = async () => {
  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });

  return newlyCreatedProducts;
};

export const getProductVariant = async ({ params }: ProductVariantProps) => {
  const { slug } = await params;
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
  return productVariant;
};

export const getLikelyProducts = async () => {
  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: {
      variants: true,
    },
  });
  return likelyProducts;
};
