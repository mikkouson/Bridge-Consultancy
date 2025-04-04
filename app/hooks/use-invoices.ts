import { useEffect } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
export function useInvoice() {
  const { data, mutate } = useSWR("/api/invoices", (url) =>
    fetch(url).then((res) => res.json())
  );

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

  return { data, mutate };
}
