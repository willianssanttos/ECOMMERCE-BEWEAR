"use client";
import { ChevronRight, MapPin, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

interface OrdersProps {
  orders: OrderDTO[];
}

const Orders = ({ orders }: OrdersProps) => {
  const router = useRouter();

  const handleOpenPaymentDetails = (orderId: string) => {
    router.push(`/my-orders/payment-details/${orderId}`);
  };

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent>
            <Accordion type="single" collapsible key={order.id}>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex flex-col gap-1">
                    {order.status === "paid" && <Badge>Pago</Badge>}
                    {order.status === "pending" && (
                      <Badge variant="outline">Pagamento pendente</Badge>
                    )}
                    {order.status === "canceled" && (
                      <Badge variant="destructive">Cancelado</Badge>
                    )}
                    <p className="text- sm font-semibold">
                      Número do pedido
                      <p className="text-muted-foreground font-medium">
                        {order.orderNumber}
                      </p>
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="mb-2">
                    <p>
                      Pedido feito em{" "}
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(order.createdAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
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
                              <div
                                className="group flex cursor-pointer items-center justify-between"
                                onClick={() =>
                                  handleOpenPaymentDetails(order.id)
                                }
                              >
                                <span className="text-sm font-semibold">
                                  <span className="text-sm font-bold">
                                  Total: {formatCentsToBRL(order.totalPriceInCents)}
                                  </span>
                                </span>
                                <span className="flex items-center gap-1">
                                  Detalhes de pagamento
                                  <ChevronRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition" />
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                    </div>
                  </div>
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
