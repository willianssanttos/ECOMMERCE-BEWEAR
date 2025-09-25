"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { addProductToCart } from "@/actions/add-cart-product";
import LoginProduct from "@/components/common/login-product";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  productVariantId: string;
  quantity: number;
}

const AddToCartButton = ({
  productVariantId,
  quantity,
}: AddToCartButtonProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["addProductToCart", productVariantId, quantity],
    mutationFn: () => addProductToCart({ productVariantId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleAddToCart = async () => {
    await mutateAsync();
  };

  return (
    <LoginProduct onAfterLogin={handleAddToCart}>
      {(_isLogged, trigger) => (
        <Button
          className="cursor-pointer rounded-full"
          size="lg"
          variant="outline"
          disabled={isPending}
          onClick={mounted ? trigger : undefined}
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Adicionar à sacola
        </Button>
      )}
    </LoginProduct>
  );
};

export default AddToCartButton;
