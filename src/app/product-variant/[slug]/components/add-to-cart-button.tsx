"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

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
      {(isLogged, trigger) => (
        <Button
          className="rounded-full cursor-pointer"
          size="lg"
          variant="outline"
          disabled={isPending}
          onClick={trigger}
        >
          {isPending && <Loader2 className="animate-spin" />}
          Adicionar à sacola
        </Button>
      )}
    </LoginProduct>
  );
};

export default AddToCartButton;