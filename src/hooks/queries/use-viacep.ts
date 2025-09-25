import { useQuery } from "@tanstack/react-query";

import { fetchViaCep } from "@/app/cart/helpers/via-cep";

export const useViaCepQueryKey = (cep: string) => ["viacep", cep];

export const useViaCep = (cep: string) => {
  return useQuery({
    queryKey: useViaCepQueryKey(cep),
    queryFn: () => fetchViaCep(cep),
    enabled: !!cep && cep.replace(/\D/g, "").length === 8,
  });
};
