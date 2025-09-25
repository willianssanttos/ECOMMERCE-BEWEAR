import { useMutation } from "@tanstack/react-query";

import { createCheckoutSession } from "@/actions/create-checkout-session";
import { CreateCheckoutSessionSchema } from "@/actions/create-checkout-session/schema";

export const useCheckoutSessionMutationKey = () => ["checkout-session"];

export function useCheckoutSession() {
  return useMutation({
    mutationKey: useCheckoutSessionMutationKey(),
    mutationFn: async (data: CreateCheckoutSessionSchema) => {
      return await createCheckoutSession(data);
    },
  });
}
