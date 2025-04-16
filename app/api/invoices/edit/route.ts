import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,

      companies(*),
      invoice_services:invoice_services!inner(*),
      payment_options(*)

      `
    )
    .eq("id", id)
    .is("deleted_at", null)
    .is("invoice_services.deleted_at", null);

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
