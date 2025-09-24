"use client";

import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/common/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

const ChegkoutPendingPage = () => {

  return (
    <>
      <Header />
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="text-center">
          <Image
            src="/payment_pending.png"
            alt="Pagamento Pendente"
            width={200}
            height={200}
            className="mx-auto"
          />
          <DialogTitle className="mt-4 text-2xl">
            Pagamento Pendente
          </DialogTitle>
          <DialogDescription className="font-medium">
            Opss! Infelizmente o seu pagamento ainda não foi aprovado ou foi cancelado. 
            <br />
            Estamos aguardando confirmação da administradora do
            cartão. Assim que o mesmo for aprovado, você será notificado(a). Caso não seja aprovado em até 24 horas, o pedido será cancelado
            automaticamente.
          </DialogDescription>
          <DialogFooter>
            <Button
              className="rounded-full "
              size="lg"
              asChild
            >
              
              <Link href="/my-orders">Meus Pedidos</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChegkoutPendingPage;
