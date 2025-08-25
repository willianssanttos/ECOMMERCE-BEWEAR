import Image from "next/image";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import {
  getLikelyProducts,
  getProductVariant,
} from "@/data/products/get-product";
import { cleanImageUrl } from "@/helpers/clean-image-url";
import { formatCentsToBRL } from "@/helpers/money";

import ProductActions from "./components/product-action";
import VariantSelector from "./components/variant-selector";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const ProductVariantPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const productVariant = await getProductVariant(slug);
  const categoryId = productVariant.product?.categoryId ?? undefined;
  const likelyProducts = await getLikelyProducts(categoryId);

  return (
    <>
      <Header />
      <div className="flex flex-col space-y-6">
        <Image
          src={cleanImageUrl(productVariant.imageUrl)}
          alt={productVariant.name}
          sizes="100vw"
          height={0}
          width={0}
          className="h-auto w-full rounded-4xl object-cover px-2"
        />

        <div className="px-5">
          <VariantSelector
            selectedVariantSlug={productVariant.slug}
            variants={productVariant.product?.variants}
          />
        </div>

        <div className="px-5">
          {/* DESCRIÇÃO */}
          <h2 className="text-lg font-semibold">
            {productVariant.product?.name}
          </h2>
          <h3 className="text-muted-foreground text-sm">
            {productVariant.name}
          </h3>
          <h3 className="text-lg font-semibold">
            {formatCentsToBRL(productVariant.priceInCents)}
          </h3>
        </div>

        <ProductActions productVariantId={productVariant.id} />

        <div className="px-5">
          <p className="text-shadow-amber-600">
            {productVariant.product?.description}
          </p>
        </div>

        <ProductList title="Talvez você goste" products={likelyProducts} />
        <Footer />
      </div>
    </>
  );
};

export default ProductVariantPage;
