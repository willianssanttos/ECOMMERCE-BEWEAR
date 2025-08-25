import "server-only";

import { db } from "@/db";

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
