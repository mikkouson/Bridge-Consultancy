"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function useInvoice() {
  const router = useRouter();

  const { data, mutate, isLoading, error } = useSWR("/api/invoices", (url) =>
    fetch(url).then((res) => res.json())
  );
  useEffect(() => {
    if (error) {
      const statusCode = error.response?.status;
      router.push(`/errors/${statusCode || 500}`);
    }
  }, [error, router]);
  const supabase = createClient();

  // Subscribe to realtime updates for appointments
  useEffect(() => {
    const channel = supabase
      .channel("realtime-invoices")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "invoices" },
        () => {
          mutate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, mutate]);

  return { data, mutate, isLoading, error };
}
