"use client"; //Esse cmponent tambem e um use clent, pois esta sendo renderizado
//  dentro de outro com´ponente use client, sendo assim se torna automaticamente

import { useQuery } from "@tanstack/react-query";
import { ShoppingBasketIcon } from "lucide-react";
import Image from "next/image";

import { getCart } from "@/actions/get-cart";

import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export const Cart = () => {
  const { data: cart, isPending: cartIsLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
  });
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
        </SheetHeader>
        <div>
          {cartIsLoading && <div>Carregando...</div>}
          {cart?.items.map((item) => (
            <div key={item.id}>
              <Image
                src={"https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Te%CC%82nis/2/2b938204_3950_4295_b61c_d4311045fed0.jpg"}
                alt={item.productVariant.product.name}
                width={100}
                height={100}
              />
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
