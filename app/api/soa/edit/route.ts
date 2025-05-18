import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");

  // First, get the statement and its related data
  const { data: statementData, error: statementError } = await supabase
    .from("statements")
    .select(
      `
      *,
      company_id(*),
      payment_option(*),
      statement_entries(*)
      `
    )
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (statementError) {
    console.error("Supabase error fetching statement:", statementError);
    return NextResponse.json(
      { error: statementError.message },
      { status: 500 }
    );
  }

  if (!statementData) {
    return NextResponse.json({ error: "Statement not found" }, { status: 404 });
  }

  // Now, get invoices for the same company
  // The problem is here - company_id is an object, not just the ID
  const companyId = statementData.company_id.id; // Extract the actual ID from the company object

  if (!companyId) {
    return NextResponse.json({
      statement: statementData,
      invoices: [],
    });
  }

  const { data: invoicesData, error: invoicesError } = await supabase
    .from("invoices")
    .select(
      `
      *,

      payments(*)
      `
    )
    .eq("company", companyId)
    .is("deleted_at", null);

  if (invoicesError) {
    console.error("Supabase error fetching invoices:", invoicesError);
    return NextResponse.json({
      statement: statementData,
      invoices: [],
      error: "Error fetching invoices: " + invoicesError.message,
    });
  }

  // Return both the statement data and the company's invoices
  return NextResponse.json({
    statement: statementData,
    invoices: invoicesData || [],
  });
}
