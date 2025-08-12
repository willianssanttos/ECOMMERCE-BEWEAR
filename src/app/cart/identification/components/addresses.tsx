"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
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
import { useCreateShippingAddress } from "@/hooks/mutations/use-create-address";
import { useShippingAddresses } from "@/hooks/queries/use-shipping-addresses";

const addressFormSchema = z.object({
  email: z.email("Informe um e-mail válido"),
  fullName: z.string().min(1, "Campo obrigatório"),
  cpf: z
    .string()
    .refine((value) => value.replace(/\D/g, "").length === 11, "CPF inválido"),
  phone: z.string().min(1, "Campo obrigatório"),
  cep: z.string().min(1, "Campo obrigatório"),
  address: z.string().min(1, "Campo obrigatório"),
  number: z.string().min(1, "Campo obrigatório"),
  complement: z.string().optional().or(z.literal("")),
  neighborhood: z.string().min(1, "Campo obrigatório"),
  city: z.string().min(1, "Campo obrigatório"),
  state: z.string().min(1, "Campo obrigatório"),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

const Addresses = () => {
  const [selectedAddress, setSelectedAdress] = useState<string | null>(null);
  const { data: addresses } = useShippingAddresses();
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      email: "",
      fullName: "",
      cpf: "",
      phone: "",
      cep: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
    mode: "onChange",
  });

  const createShippingAddressMutation = useCreateShippingAddress();

  async function handleSubmit(values: AddressFormValues) {
    await createShippingAddressMutation.mutateAsync({
      email: values.email,
      fullName: values.fullName,
      cpf: values.cpf,
      phone: values.phone,
      cep: values.cep,
      address: values.address,
      number: values.number,
      complement: values.complement,
      neighborhood: values.neighborhood,
      city: values.city,
      state: values.state,
    });
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAddress ?? undefined}
          onValueChange={setSelectedAdress}
        >
          <Card>
            <CardContent>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add_new" id="add_new" />
                <Label htmlFor="add_new">Adicionar novo endereço</Label>
              </div>
            </CardContent>
          </Card>
          {addresses?.map((address) => (
            <Card key={address.id}>
              <CardContent>
                <div className="flex items-center space-x-2 py-3">
                  <RadioGroupItem value={address.id} id={address.id} />
                  <div>
                    <p className="text-sm">
                      {address.recipientName} • {address.email} •{" "}
                      {address.phone} • Rua: {address.street}, Nº:{" "}
                      {address.number} {" "}
                      {address.complement ? ` - ${address.complement}` : ""},
                      {address.neighborhood} - {address.city}/{address.state},
                      CEP {address.zipCode}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </RadioGroup>

        {selectedAddress === "add_new" && (
          <div className="mt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
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
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <PatternFormat
                          value={field.value}
                          onValueChange={(values) =>
                            field.onChange(values.value)
                          }
                          format="###.###.###-##"
                          customInput={Input}
                          placeholder="000.000.000-00"
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
                          value={field.value}
                          onValueChange={(values) =>
                            field.onChange(values.value)
                          }
                          format="(##) #####-####"
                          customInput={Input}
                          placeholder="(00) 90000-0000"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <PatternFormat
                          value={field.value}
                          onValueChange={(values) =>
                            field.onChange(values.value)
                          }
                          format="#####-###"
                          customInput={Input}
                          placeholder="00000-000"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua/Av." {...field} />
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
                        <Input placeholder="Número" {...field} />
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
                        <Input placeholder="Opcional" {...field} />
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
                        <Input placeholder="Bairro" {...field} />
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
                        <Input placeholder="Cidade" {...field} />
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
                        <Input placeholder="UF" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={createShippingAddressMutation.isPending}
                  >
                    Salvar endereço
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Addresses;
