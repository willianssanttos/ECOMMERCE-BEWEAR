import { useQuery } from "@tanstack/react-query";

import { fetchViaCep } from "@/app/api/viacep/route";

export const useViaCepQueryKey = (cep: string) => ["viaCep", cep];

export const useViaCep = (cep: string) => {
  return useQuery({
    queryKey: useViaCepQueryKey(cep),
    queryFn: () => fetchViaCep(cep),
    enabled: !!cep && cep.replace(/\D/g, "").length === 8,
  });
};
