"use server";

import {
  InvoicesSchema,
  InvoicesSchemaType,
  ServiceType,
} from "@/app/types/invoices.type";
import { createClient } from "@/utils/supabase/server";

export async function createInvoice(formData: InvoicesSchemaType) {
  const result = InvoicesSchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createClient();

  // Insert the invoice data
  const { data: invoiceData, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      company: formData.company,
      invoice_number: formData.invoice_number,
      date: formData.date,
      payment_option: formData.payment_option,
      currency: formData.currency,
      invoice_type: formData.invoice_type,
      trn: formData.trn,
      exchange_rate: formData.exchange_rate.toFixed(2),
      subject: formData.subject,
    })
    .select() // Add this to return the inserted data
    .single();

  if (invoiceError) {
    throw new Error(invoiceError.message);
  }

  if (!invoiceData) {
    throw new Error("Failed to create invoice");
  }

  // Insert the invoice services data using the invoice ID from the previous insert
  const { data: invoiceServicesData, error: invoiceServicesError } =
    await supabase.from("invoice_services").insert(
      formData.services.map((service) => ({
        invoice_id: invoiceData.id,
        service_id: service.service_id,
        service_vat: service.service_vat,
        service_vat_amount: service.service_vat_amount,
        service_date: service.service_date,
        service_name: service.service_name,
        base_amount: service.amount,
        exchange_rate: formData.exchange_rate.toFixed(2),
        currency: formData.currency,
      }))
    );

  if (invoiceServicesError) {
    throw new Error(invoiceServicesError.message);
  }

  return { invoiceData, invoiceServicesData };
}

export async function deleteInvoice(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("invoices")
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  } else {
    return true;
  }
}

export async function updateInvoice(formData: InvoicesSchemaType) {
  const result = InvoicesSchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  const supabase = await createClient();

  // Update the invoice data
  const { data: invoiceData, error: invoiceError } = await supabase
    .from("invoices")
    .update({
      company: formData.company,
      invoice_number: formData.invoice_number,
      date: formData.date,
      payment_option: formData.payment_option,
      currency: formData.currency,
      exchange_rate: formData.exchange_rate.toFixed(2),
      subject: formData.subject,
      invoice_type: formData.invoice_type,
      trn: formData.trn,
    })
    .eq("id", formData.id)
    .select()
    .single();

  if (invoiceError) {
    throw new Error(invoiceError.message);
  }

  if (!invoiceData) {
    throw new Error("Failed to update invoice");
  }

  // Fetch existing services for this invoice (that aren't already soft-deleted)
  const { data: existingServices, error: fetchServicesError } = await supabase
    .from("invoice_services")
    .select("*")
    .eq("invoice_id", formData.id)
    .is("deleted_at", null);

  if (fetchServicesError) {
    throw new Error(fetchServicesError.message);
  }

  // Create maps for easier comparison
  const existingServicesMap = new Map(
    existingServices?.map((service) => [service.id, service]) || []
  );

  // Separate services into new and existing ones
  const existingServicesToUpdate: ServiceType = [];
  const newServicesToInsert: ServiceType = [];

  formData.services.forEach((service) => {
    if (service.id && existingServicesMap.has(service.id)) {
      // This is an existing service that needs updating
      existingServicesToUpdate.push({
        id: service.id,
        invoice_id: formData.id,
        service_id: service.service_id,
        service_vat: service.service_vat,
        service_vat_amount: service.service_vat_amount,
        service_date: service.service_date,
        service_name: service.service_name,
        base_amount: service.amount,
        exchange_rate: parseFloat(formData.exchange_rate.toFixed(2)),

        currency: formData.currency,
      });
    } else {
      // This is a new service that needs to be inserted
      newServicesToInsert.push({
        invoice_id: formData.id,
        service_id: service.service_id,
        service_vat: service.service_vat,
        service_vat_amount: service.service_vat_amount,
        service_date: service.service_date,
        service_name: service.service_name,
        base_amount: service.amount,
        exchange_rate: parseFloat(formData.exchange_rate.toFixed(2)),
        currency: formData.currency,
      });
    }
  });

  // Find services to soft-delete (exist in database but not in incoming data)
  const serviceIdsToDelete = Array.from(existingServicesMap.keys()).filter(
    (existingId) => !formData.services.some((s) => s.id === existingId)
  );

  // Update existing services
  let updatedServices = [];
  if (existingServicesToUpdate.length > 0) {
    const { data, error: updateError } = await supabase
      .from("invoice_services")
      .upsert(existingServicesToUpdate)
      .select();

    if (updateError) {
      throw new Error(`Error updating services: ${updateError.message}`);
    }
    updatedServices = data || [];
  }

  // Insert new services
  let insertedServices = [];
  if (newServicesToInsert.length > 0) {
    const { data, error: insertError } = await supabase
      .from("invoice_services")
      .insert(newServicesToInsert)
      .select();

    if (insertError) {
      throw new Error(`Error inserting new services: ${insertError.message}`);
    }
    insertedServices = data || [];
  }

  // Soft delete services that no longer exist by setting deleted_at
  if (serviceIdsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("invoice_services")
      .update({ deleted_at: new Date().toISOString() })
      .in("id", serviceIdsToDelete);

    if (deleteError) {
      throw new Error(`Error removing services: ${deleteError.message}`);
    }
  }

  return {
    invoiceData,
    updatedServices,
    insertedServices,
    deletedServiceIds: serviceIdsToDelete,
  };
}
