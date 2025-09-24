import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { getOrders } from "@/data/my-orders/my-orders";
import { cleanImageUrl } from "@/helpers/clean-image-url";

import Orders from "./components/orders";

const MyOrdersPage = async () => {
  const orders = await getOrders();

  return (
    <>
      <Header />
      <div className="px-5">
        <Orders
          orders={orders.map((order) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            totalPriceInCents: order.totalPriceInCents,
            status: order.status,
            createdAt: order.createdAt,
            payment: order.payment,
            items: order.items.map((item) => ({
              id: item.id,
              imageUrl: cleanImageUrl(item.productVariant.imageUrl),
              productName: item.productVariant.product.name,
              productVariantName: item.productVariant.name,
              priceInCents: item.priceInCents,
              quantity: item.quantity,
            })),
            recipientName: order.recipientName,
            phone: order.phone,
            street: order.street,
            number: order.number,
            complement: order.complement,
            neighborhood: order.neighborhood,
            city: order.city,
            state: order.state,
            zipCode: order.zipCode,
            country: order.country,
            email: order.email,
            cpfOrCnpj: order.cpfOrCnpj,
          }))}
        />
      </div>
      <Footer />
    </>
  );
};

export default MyOrdersPage;
