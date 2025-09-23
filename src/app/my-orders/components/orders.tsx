"use client";

import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  MapPin,
  User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderDTO } from "@/data/my-orders/my-orders";
import { cleanImageUrl } from "@/helpers/clean-image-url";
import { formatCentsToBRL } from "@/helpers/money";
import { useCheckoutSession } from "@/hooks/mutations/use-checkout-session";

interface OrdersProps {
  orders: OrderDTO[];
}

const Orders = ({ orders }: OrdersProps) => {
  const router = useRouter();
  const checkoutSessionMutation = useCheckoutSession();
  const handleOpenPaymentDetails = (orderId: string) => {
    router.push(`/my-orders/payment-details/${orderId}`);
  };

  const handleUpdatePayment = async (orderId: string) => {
    const checkoutSession = await checkoutSessionMutation.mutateAsync({ orderId });
    if (checkoutSession.url) {
      window.location.href = checkoutSession.url;
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent>
            <Accordion type="single" collapsible key={order.id}>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex cursor-pointer flex-col gap-1">
                    {order.status === "paid" && <Badge>Pago</Badge>}
                      {order.status === "pending" && (
                      <Badge variant="outline">Pagamento pendente</Badge>
                    )}
                    {order.status === "canceled" && (
                      <Badge variant="destructive">Cancelado</Badge>
                    )}
                    <p className="text-sm font-semibold">
                      Número do pedido
                      <p className="text-muted-foreground font-medium">
                        {order.orderNumber}
                      </p>
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {order.items.map((product) => (
                    <div
                      className="flex items-center justify-between"
                      key={product.id}
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={cleanImageUrl(product.imageUrl)}
                          alt={product.productName}
                          width={78}
                          height={78}
                          className="mt-2 rounded-lg"
                        />
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-semibold">
                            {product.productName}
                          </p>
                          <p className="text-muted-foreground text-xs font-medium">
                            {product.productVariantName} x {product.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-center gap-2">
                        <p className="text-sm font-bold">
                          {formatCentsToBRL(
                            product.priceInCents * product.quantity,
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="py-5">
                    <Separator />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm">Subtotal</p>
                      <p className="text-muted-foreground text-sm font-medium">
                        {formatCentsToBRL(order.totalPriceInCents)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Frete</p>
                      <p className="text-muted-foreground text-sm font-medium">
                        GRÁTIS
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Total</p>
                      <p className="text-sm font-semibold">
                        {formatCentsToBRL(order.totalPriceInCents)}
                      </p>
                    </div>
                  </div>
                    {order.status === "pending" && (
                      <div>
                        <div className="py-5">
                          <Separator />
                        </div>
                        <div className="mb-4 flex flex-col gap-2">
                          <span className="text-xs font-medium text-yellow-700">
                            Estamos aguardando o pagamento do seu pedido, realize
                            atualização do pagamento com outra forma de pagamento, ou
                            em até 24 horas caso o pagamento não seja aprovado, seu
                            pedido será cancelado automaticamente.
                          </span>
                          <button
                            type="button"
                            className="rounded-md bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90 transition"
                            onClick={() => handleUpdatePayment(order.id)}
                          >
                            Atualizar pagamento
                          </button>
                        </div>
                      </div>
                    )}
                  <div className="py-5">
                    <Separator />
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold">
                        Informações da entrega
                      </p>
                      <div className="flex items-center gap-2">
                        <User className="text-muted-foreground h-4 w-4" />
                        <p className="text-sm font-semibold">
                          {order.recipientName} &nbsp;{order.phone}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="text-muted-foreground h-4 w-4" />
                        <p className="text-sm">
                          {order.street}, {order.number}
                          {order.complement && `, ${order.complement}`},{" "}
                          {order.neighborhood}, {order.city} - {order.state},
                          CEP: {order.zipCode}
                        </p>
                      </div>
                      <div className="py-5">
                        <Separator />
                      </div>
                      <Card>
                        <CardContent>
                          <button
                            className="group flex w-full cursor-pointer items-center justify-between"
                            onClick={() => handleOpenPaymentDetails(order.id)}
                          >
                            <span className="text-sm font-semibold">
                              <span className="text-sm font-bold">
                                Total:{" "}
                                {formatCentsToBRL(order.totalPriceInCents)}
                              </span>
                            </span>
                            <span className="flex items-center">
                              Detalhes de pagamento
                              <ChevronRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition" />
                            </span>
                          </button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  <div className="py-5">
                    <Separator />
                  </div>
                  <Card className="mb-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="text-base font-semibold">
                            Número do pedido
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {order.orderNumber}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs">Nota Fiscal</span>
                        <button
                          type="button"
                          className="flex cursor-pointer items-center"
                        >
                          Ver <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                      <Separator className="my-3" />
                      <div
                        className={`transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}
                      >
                        <div className="flex justify-between py-1">
                          <span className="text-xs">Pedido realizado em</span>
                          <span className="text-xs">
                            {new Date(order.createdAt).toLocaleDateString(
                              "pt-BR",
                            )}{" "}
                            às
                            {new Date(order.createdAt).toLocaleTimeString(
                              "pt-BR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-xs">Data do pagamento</span>
                          <span className="text-xs">
                            {order.payment?.paidAt
                              ? `${new Date(order.payment.paidAt).toLocaleDateString("pt-BR")} às 
                              ${new Date(order.payment.paidAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
                              : "--"}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-xs">Postado em</span>
                          <span className="text-xs">
                            {order.shippedAt
                              ? `${new Date(order.shippedAt).toLocaleDateString("pt-BR")} ${new Date(order.shippedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
                              : "--"}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-xs">Concluído em</span>
                          <span className="text-xs">
                            {order.completedAt
                              ? `${new Date(order.completedAt).toLocaleDateString("pt-BR")} ${new Date(order.completedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
                              : "--"}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-primary mt-2 flex w-full cursor-pointer items-center justify-center font-bold"
                        onClick={() => setIsOpen((prev) => !prev)}
                      >
                        Fechar
                        {isOpen ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </button>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Orders;
