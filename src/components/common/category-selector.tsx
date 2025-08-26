import Link from "next/link";

import type { CategoriesDTO } from "@/data/categories/categories";

import { Button } from "../ui/button";

interface CategorySelectorProps {
  categories: CategoriesDTO[];
}

const CategorySelector = ({ categories }: CategorySelectorProps) => {
  return (
    <div className="px-5">
      <div className="rounded-3xl bg-[#F4EFFF] p-6">
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              className="rounded-full bg-white text-xs font-semibold"
            >
              <Link href={`/category/${category.slug}`}>{category.name}</Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;
