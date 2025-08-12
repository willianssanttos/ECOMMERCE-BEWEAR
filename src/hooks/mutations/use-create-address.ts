import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createShippingAddress } from "@/actions/create-address";
import { getUseShippingAddressesQueryKey } from "@/hooks/queries/use-shipping-addresses";

export const getCreateShippingAddressMutationKey = () =>
  ["create-shipping-address"] as const;

export const useCreateShippingAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getCreateShippingAddressMutationKey(),
    mutationFn: createShippingAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUseShippingAddressesQueryKey(),
      });
    },
  });
};
