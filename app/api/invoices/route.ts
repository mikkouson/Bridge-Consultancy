import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,

      companies(*),
      invoice_services:invoice_services!inner(*),
      payment_options(*),
      payments(*)
      `
    )
    .is("deleted_at", null)
    .is("invoice_services.deleted_at", null);

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
