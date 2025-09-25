"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShippingAddressDTO } from "@/data/identification/identification";
import { useCreateShippingAddress } from "@/hooks/mutations/use-create-address";
import { useRemoveAddress } from "@/hooks/mutations/use-remove-address";
import { useUpdateCartShippingAddress } from "@/hooks/mutations/use-update-cart-shipping-address";
import { useUserAddresses } from "@/hooks/queries/use-shipping-addresses";
import { useViaCep } from "@/hooks/queries/use-viacep";

import { formatAddress } from "../../helpers/address";
import { cnpjIsValid } from "../../helpers/validate-cnpj";
import { cpfIsValid } from "../../helpers/validate-cpf";

const formSchema = z.object({
  email: z.email("Informe um e-mail válido"),
  fullName: z.string().min(1, "Campo obrigatório"),
  cpfOrCnpj: z.string().superRefine((value, ctx) => {
    const sanitized = value.replace(/\D/g, "");
    if (sanitized.length === 11 && !cpfIsValid(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CPF inválido",
      });
    } else if (sanitized.length === 14 && !cnpjIsValid(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CNPJ inválido",
      });
    } else if (sanitized.length !== 11 && sanitized.length !== 14) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe um CPF ou CNPJ válido",
      });
    }
  }),
  phone: z.string().min(1, "Campo obrigatório"),
  zipCode: z.string().min(1, "Campo obrigatório"),
  address: z.string().min(1, "Campo obrigatório"),
  number: z.string().min(1, "Campo obrigatório"),
  complement: z.string().optional().or(z.literal("")),
  neighborhood: z.string().min(1, "Campo obrigatório"),
  city: z.string().min(1, "Campo obrigatório"),
  state: z.string().min(1, "Campo obrigatório"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddressesProps {
  shippingAddresses: ShippingAddressDTO[];
  defaultShippingAddressId: string | null;
}

const Addresses = ({
  shippingAddresses,
  defaultShippingAddressId,
}: AddressesProps) => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(
    defaultShippingAddressId || null,
  );
  const createShippingAddressMutation = useCreateShippingAddress();
  const updateCartShippingAddressMutation = useUpdateCartShippingAddress();
  const removeAddressMutation = useRemoveAddress();
  const { data: addresses, isLoading } = useUserAddresses({
    initialData: shippingAddresses,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      cpfOrCnpj: "",
      phone: "",
      zipCode: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const zipCodeValue = form.watch("zipCode");
  const {
    data: viaCepData,
    isFetching: isFetchingCep,
    error: cepError,
  } = useViaCep(zipCodeValue);

  useEffect(() => {
    if (viaCepData) {
      form.setValue("address", viaCepData.logradouro || "");
      form.setValue("neighborhood", viaCepData.bairro || "");
      form.setValue("city", viaCepData.localidade || "");
      form.setValue("state", viaCepData.uf || "");
    }
  }, [viaCepData, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const newAddress =
        await createShippingAddressMutation.mutateAsync(values);
      toast.success("Endereço criado com sucesso!");
      form.reset();
      setSelectedAddress(newAddress.id);

      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: newAddress.id,
      });
      toast.success("Endereço vinculado ao carrinho!");
    } catch (error) {
      toast.error("Erro ao criar endereço. Tente novamente.");
      console.error(error);
    }
  };

  const handleGoToPayment = async () => {
    if (!selectedAddress || selectedAddress === "add_new") return;

    try {
      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: selectedAddress,
      });
      toast.success("Endereço selecionado para entrega!");
      router.push("/cart/confirmation");
    } catch (error) {
      toast.error("Erro ao selecionar endereço. Tente novamente.");
      console.error(error);
    }
  };

  const handleRemoveAddress = async (addressId: string) => {
    try {
      await removeAddressMutation.mutateAsync({ addressId });
      toast.success("Endereço removido com sucesso!");
    } catch {
      toast.error("Não foi possível remover o endereço.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center">
            <p>Carregando endereços...</p>
          </div>
        ) : (
          <RadioGroup
            value={selectedAddress}
            onValueChange={setSelectedAddress}
          >
            {addresses?.length === 0 && (
              <div className="py-4 text-center">
                <p className="text-muted-foreground">
                  Você ainda não possui endereços cadastrados.
                </p>
              </div>
            )}

            {addresses?.map((address) => (
              <Card key={address.id}>
                <CardContent>
                  <div className="flex items-center space-x-2 py-3">
                    <RadioGroupItem value={address.id} id={address.id} />
                    <div className="flex-1">
                      <p className="text-sm">{formatAddress(address)}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Remover endereço"
                      onClick={() => handleRemoveAddress(address.id)}
                      disabled={removeAddressMutation.isPending}
                    >
                      <Trash2 className="text-destructive h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="add_new" id="add_new" />
                  <Label htmlFor="add_new">Adicionar novo endereço</Label>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        )}

        {selectedAddress && selectedAddress !== "add_new" && (
          <div className="mt-4">
            <Button
              onClick={handleGoToPayment}
              className="w-full rounded-full cursor-pointer"
              size="lg"
              disabled={updateCartShippingAddressMutation.isPending}
            >
              {updateCartShippingAddressMutation.isPending
                ? "Processando..."
                : "Ir para pagamento"}
            </Button>
          </div>
        )}

        {selectedAddress === "add_new" && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-4 space-y-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite seu nome completo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpfOrCnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF ou CNPJ</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o CPF ou CNPJ"
                          maxLength={18}
                          value={field.value}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, "");
                            let formatted = e.target.value;
                            if (rawValue.length <= 11) {
                              formatted = rawValue
                                .replace(/^(\d{3})(\d)/, "$1.$2")
                                .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
                                .replace(
                                  /^(\d{3})\.(\d{3})\.(\d{3})(\d)/,
                                  "$1.$2.$3-$4",
                                );
                            } else if (rawValue.length <= 14) {
                              formatted = rawValue
                                .replace(/^(\d{2})(\d)/, "$1.$2")
                                .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
                                .replace(
                                  /^(\d{2})\.(\d{3})\.(\d{3})(\d)/,
                                  "$1.$2.$3/$4",
                                )
                                .replace(
                                  /^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/,
                                  "$1.$2.$3/$4-$5",
                                );
                            }
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Celular</FormLabel>
                      <FormControl>
                        <PatternFormat
                          format="(##) #####-####"
                          placeholder="(11) 99999-9999"
                          customInput={Input}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <PatternFormat
                          format="#####-###"
                          placeholder="00000-000"
                          customInput={Input}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      {isFetchingCep && (
                        <span className="text-muted-foreground text-xs">
                          Buscando endereço...
                        </span>
                      )}
                      {cepError && (
                        <span className="text-destructive text-xs">
                          CEP não encontrado!
                        </span>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu endereço" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o número" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Apto, bloco, etc. (opcional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite a cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o estado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-full cursor-pointer"
                disabled={
                  createShippingAddressMutation.isPending ||
                  updateCartShippingAddressMutation.isPending
                }
              >
                {createShippingAddressMutation.isPending ||
                updateCartShippingAddressMutation.isPending
                  ? "Salvando..."
                  : "Salvar endereço"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default Addresses;
