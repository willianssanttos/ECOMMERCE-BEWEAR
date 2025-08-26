import "server-only";

import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";

export interface CategoriesDTO {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export const getCategories = async () => {
  const categories = await db.query.categoryTable.findMany({});

  return categories as CategoriesDTO[];
};

export const getCategoryPage = async (slug: string): Promise<CategoriesDTO> => {
  const category = await db.query.categoryTable.findFirst({
    where: eq(categoryTable.slug, slug),
  });
  if (!category) {
    return notFound();
  }
  return category as CategoriesDTO;
};

