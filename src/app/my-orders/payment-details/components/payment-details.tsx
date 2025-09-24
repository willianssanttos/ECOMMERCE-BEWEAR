"use client";
import { ArrowLeft, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PaymentDTO } from "@/data/payment/payment";
import { formatCentsToBRL } from "@/helpers/money";

interface PaymentDetailsProps {
  payment: PaymentDTO;
  subtotal: number;
  total: number;
  shippingFee: number;
  discount: number;
  billingAddress?: {
    order: {
      recipientName: string;
      phone: string;
      street: string;
      number: string;
      complement?: string | null;
      neighborhood: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  };
}

const getPaymentMethod = (method: string | undefined) => {
  if (method === "pix") return "Pix";
  if (method === "card")
    return "Cartão de crédito local com parcelamento";
  if (method === "boleto") return "Boleto";
  return "Não informado";
};

const PaymentDetails = ({
  payment,
  subtotal,
  total,
  shippingFee,
  discount,
  billingAddress,
}: PaymentDetailsProps) => {
  const router = useRouter();
  const paymentMethod = getPaymentMethod(payment?.method);

  return (
    <Card>
      <div className="-mt-2 flex items-center justify-between px-4">
        <button
          type="button"
          onClick={() => router.push("/my-orders")}
          className="p-2"
          aria-label="Voltar para pedidos"
        >
          <ArrowLeft className="text-muted-foreground h-4 w-4 cursor-pointer" />
        </button>
        <CardTitle className="flex-1 text-center font-bold">
          Detalhes de pagamento
        </CardTitle>
      </div>
      <Separator className="-mt-2" />
      <CardContent className="-mt-2 space-y-2 pt-2">
        <div>
          <p className="mb-1 text-sm font-semibold">Endereço para Envio:</p>
          <div className="text-muted-foreground text-xs leading-tight">
            {billingAddress?.order.recipientName} {" "}
            {billingAddress?.order.phone}
            <br />
            {billingAddress?.order.street}, {billingAddress?.order.number}
            {billingAddress?.order.complement &&
              `, ${billingAddress?.order.complement}`}
            <br />
            {billingAddress?.order.neighborhood}, {billingAddress?.order.city} -{" "}
            {billingAddress?.order.state}, CEP: {billingAddress?.order.zipCode}
          </div>
        </div>
        <hr className="my-4" />
        {billingAddress && (
          <div>
            <p className="mb-1 text-sm font-semibold">Endereço de faturação:</p>
            <div className="text-muted-foreground text-xs leading-tight">
              {billingAddress?.order.recipientName}{" "}
              {billingAddress?.order.phone}
              <br />
              {billingAddress?.order.street}, {billingAddress?.order.number}
              {billingAddress?.order.complement &&
                `, ${billingAddress?.order.complement}`}
              <br />
              {billingAddress?.order.neighborhood}, {billingAddress?.order.city}{" "}
              - {billingAddress?.order.state}, CEP:{" "}
              {billingAddress?.order.zipCode}
            </div>
          </div>
        )}
        <Separator />
        <div className="-mt-2 mb-0 flex items-center justify-between">
          <p className="text-sm font-semibold">Método de pagamento:</p>
          <CreditCard className="text-muted-foreground h-8 w-8 items-center" />
        </div>
        <p className="text-muted-foreground -mt-2 text-xs leading-tight">
          {paymentMethod}
        </p>
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-sm">Valor Total:</p>
            <p className="text-muted-foreground text-sm font-medium">
              {formatCentsToBRL(total)}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm">Subtotal:</p>
            <p className="text-muted-foreground text-sm font-medium">
              {formatCentsToBRL(subtotal)}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm">Taxa de envio:</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-600">
                {shippingFee === 0 ? "Grátis" : formatCentsToBRL(shippingFee)}
              </span>
              {shippingFee !== 0 && (
                <span className="text-muted-foreground text-xs line-through">
                  {formatCentsToBRL(shippingFee)}
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <p className="text-sm">Entrega garantida:</p>
            <span className="text-sm font-medium text-green-600">GRÁTIS</span>
          </div>
          <div className="flex justify-between">
            <p className="text-sm">Desconto:</p>
            <p className="text-sm font-medium text-red-600">
              {discount === 0 ? "-R$0,00" : `-${formatCentsToBRL(discount)}`}
            </p>
          </div>
        </div>
        <Separator />
        <div className="mt-2 flex justify-between">
          <p className="text-base font-bold">Total</p>
          <p className="text-base font-bold">{formatCentsToBRL(total)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentDetails;
