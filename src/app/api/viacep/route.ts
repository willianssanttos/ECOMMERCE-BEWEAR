import { NextRequest, NextResponse } from "next/server";

import { fetchViaCep } from "@/helpers/via-cep";

export async function GET(request: NextRequest) {
  const cep = request.nextUrl.searchParams.get("cep");
  if (!cep) {
    return NextResponse.json({ error: "CEP não informado" }, { status: 400 });
  }
  try {
    const data = await fetchViaCep(cep);
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
  }
}
