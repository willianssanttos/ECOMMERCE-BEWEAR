import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

import VariantSelector from "./components/variant-selector";
import QuantitySelector from "./components/quantity-selector";

interface ProductVariantProps {
  params: Promise<{ slug: string }>;
}

const ProductVariantPage = async ({ params }: ProductVariantProps) => {
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

  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: {
      variants: true,
    },
  });

  return (
    <>
      <Header />
      <div className="flex flex-col space-y-6">
        {/* Imagem*/}
        <div className="relative h-[380px] w-full rounded-3xl">
          <Image
            src={
              "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Te%CC%82nis/2/2b938204_3950_4295_b61c_d4311045fed0.jpg"
            }
            sizes="100vw"
            height={0}
            width={0}
            className="h-auto w-full rounded-3xl"
          />
        </div>
        <div className="px-5">
          <VariantSelector
            selectedVariantSlug={productVariant.slug}
            variants={productVariant.product.variants}
          />
        </div>

        <div className="px-5">
          {/* DESCRIÇÃO*/}

          <h2 className="text-lg font-semibold">
            {productVariant.product.name}
          </h2>
          <h3 className="text-muted-foreground text-sm">
            {productVariant.name}
          </h3>
          <h3 className="text-lg font-semibold">
            {formatCentsToBRL(productVariant.priceInCents)}
          </h3>
        </div>
        <div className="px-5">
          <QuantitySelector />
        </div>

        <div className="flex flex-col space-y-4 px-5">
          <Button>Comprar agora</Button>
          <Button>Adicionar á sacola</Button>
        </div>

        <div className="px-5">
          <p className="text-shadow-amber-600">
            {productVariant.product.description}
          </p>
        </div>

        <ProductList title="Talvez você goste" products={likelyProducts} />
      </div>
      <Footer />
    </>
  );
};

export default ProductVariantPage;
