import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeAddress } from "@/actions/remove-address";

import { getUseShippingAddressesQueryKey } from "../queries/use-shipping-addresses";

export const getUseRemoveAddressMutationKey = () => ["remove-address"];

export const useRemoveAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getUseRemoveAddressMutationKey(),
    mutationFn: (input: { addressId: string }) => removeAddress(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUseShippingAddressesQueryKey(),
      });
    },
  });
};
