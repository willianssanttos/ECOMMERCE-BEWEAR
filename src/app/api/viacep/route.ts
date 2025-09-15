type ViaCepResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  err: boolean;
};

export const fetchViaCep = async (cep: string): Promise<ViaCepResponse> => {
  const sanitizedCep = cep.replace(/\D/g, "");
  const response = await fetch(
    `https://viacep.com.br/ws/${sanitizedCep}/json/`,
  );
  if (!response.ok) throw new Error("Erro ao buscar o CEP");
  const data = await response.json();
  if (data.erro) throw new Error("CEP não encontrado");
  return data;
};
