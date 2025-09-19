import { notFound } from "next/navigation";

import { getOrders } from "@/data/my-orders/my-orders";

import PaymentDetails from "../components/payment-details";

interface PaymentPageProps {
  params: { orderId: string };
}

const PaymentPage = async (props: PaymentPageProps) => {
  const params = await props.params;
  const { orderId } = params;
  const orders = await getOrders();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return notFound();
  }

  return (
    <div className="h-auto w-full px-5 py-4">
      <PaymentDetails
        payment={order.payment}
        subtotal={order.totalPriceInCents}
        total={order.totalPriceInCents}
        shippingFee={0}
        discount={0}
        billingAddress={{
          order: {
            recipientName: order.recipientName,
            phone: order.phone,
            street: order.street,
            number: order.number,
            complement: order.complement,
            neighborhood: order.neighborhood,
            city: order.city,
            state: order.state,
            country: order.country,
            zipCode: order.zipCode,
          },
        }}
      />
    </div>
  );
};

export default PaymentPage;
