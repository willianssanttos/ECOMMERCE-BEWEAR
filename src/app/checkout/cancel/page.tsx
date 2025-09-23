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

const ChegkoutCancelPage = () => {
  return (
    <>
      <Header />
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="text-center">
          <Image
            src="/cancel.jpg"
            alt="Cancel"
            width={300}
            height={300}
            className="mx-auto"
          />
          <DialogTitle className="mt-4 text-2xl">Pedido Cancelado</DialogTitle>
          <DialogDescription className="font-medium">
            O pagamento do seu pedido não foi realizado ou foi cancelado.<br />
            Se desejar, tente novamente ou acesse “Meus Pedidos” para mais detalhes.
          </DialogDescription>
          <DialogFooter>
            <Button className="rounded-full" size="lg" asChild>
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

export default ChegkoutCancelPage;