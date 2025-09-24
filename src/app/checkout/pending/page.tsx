"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Header } from "@/components/common/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCheckoutSession } from "@/hooks/mutations/use-checkout-session";

const ChegkoutPendingPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const checkoutSessionMutation = useCheckoutSession();

  const handleUpdatePayment = async () => {
    setIsLoading(true);
    try {
      const orderId = window.location.search.split("orderId=")[1];
      if (!orderId) return;
      const checkoutSession = await checkoutSessionMutation.mutateAsync({
        orderId,
      });
      if (checkoutSession.url) {
        window.location.href = checkoutSession.url;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="text-center">
          <Image
            src="/payment_pending.png"
            alt="Pagamento Pendente"
            width={300}
            height={300}
            className="mx-auto"
          />
          <DialogTitle className="mt-4 text-2xl">
            Pagamento Pendente
          </DialogTitle>
          <DialogDescription className="font-medium">
            Seu pagamento está aguardando confirmação da administradora do
            cartão.
            <br />
            Caso não seja aprovado em até 24 horas, o pedido será cancelado
            automaticamente.
            <br />
            Você pode tentar atualizar o pagamento agora.
          </DialogDescription>
          <DialogFooter>
            <Button
              className="rounded-full"
              size="lg"
              onClick={handleUpdatePayment}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Atualizar pagamento
            </Button>
            <Button
              className="rounded-full"
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="/my-orders">Meus Pedidos</Link>
            </Button>
            <Button
              className="rounded-full"
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="/">Voltar para a loja</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChegkoutPendingPage;
