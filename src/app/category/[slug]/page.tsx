import { Header } from "@/components/common/header";
import ProductItem from "@/components/common/product-item";
import { getCategoryPage } from "@/data/categories/categories";
import { getLikelyProducts } from "@/data/products/product";
interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;
  const category = await getCategoryPage(slug);
  const products = await getLikelyProducts(category.id);
  
  return (
    <>
      <Header />
      <div className="space-y-6 px-5">
        <h2 className="text-xl font-semibold">{category.name}</h2>
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              textContainerClassName="max-w-full"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
