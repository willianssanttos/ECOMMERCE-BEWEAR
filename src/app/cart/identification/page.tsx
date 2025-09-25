import { redirect } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import {
  getIdentificationAndConfirmation,
  getShippingAddresses,
} from "@/data/identification/identification";
import { cleanImageUrl } from "@/helpers/clean-image-url";

import CartSummary from "../components/cart-summary";
import Addresses from "./components/addresses";

const IdentificationPage = async () => {
  const cart = await getIdentificationAndConfirmation();
  if (!cart || cart?.items.length === 0) {
    redirect("/");
  }

  const shippingAddresses = await getShippingAddresses();
  const cartTotalInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );

  return (
    <div>
      <Header />
      <div className="space-y-4 px-5">
        <div className="cursor-pointer">
          <Addresses
          shippingAddresses={shippingAddresses}
          defaultShippingAddressId={
            cart.shippingAddress ? cart.shippingAddress.id : null
          }
        />
        </div>
        
        <CartSummary
          subtotalInCents={cartTotalInCents}
          totalInCents={cartTotalInCents}
          products={cart.items.map((item) => ({
            id: item.productVariant.id,
            name: item.productVariant.product.name,
            variantName: item.productVariant.name,
            quantity: item.quantity,
            priceInCents: item.productVariant.priceInCents,
            imageUrl: cleanImageUrl(item.productVariant.imageUrl),
          }))}
        />
      </div>
      <Footer />
    </div>
  );
};

export default IdentificationPage;
