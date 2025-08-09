import Image from "next/image";
import Link from "next/link";

import { productVariantTable } from "@/db/schema";

interface VariantSelectorProps {
  selectedVariantSlug: string;
  variants: (typeof productVariantTable.$inferSelect)[];
}

const VariantSelector = ({
  selectedVariantSlug,
  variants,
}: VariantSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      {variants.map((variant) => (
        <Link
          href={`/product-variant/${variant.slug}`}
          key={variant.id}
          className={
            selectedVariantSlug === variant.slug
              ? "border-primary rounded-xl border-2"
              : ""
          }
        >
          <Image
            width={68}
            height={68}
            src={
              "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Te%CC%82nis/2/2b938204_3950_4295_b61c_d4311045fed0.jpg"
            }
            alt={variant.name}
            className="rounded-xl"
          />
        </Link>
      ))}
    </div>
  );
};

export default VariantSelector;
