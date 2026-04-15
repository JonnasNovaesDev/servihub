import { NextRequest, NextResponse } from "next/server";
import { getProviderById } from "@/lib/queries/providers";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const provider = await getProviderById(params.id);

    if (!provider) {
      return NextResponse.json({ error: "Prestador não encontrado" }, { status: 404 });
    }

    return NextResponse.json(provider);
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
