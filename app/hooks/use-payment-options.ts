import { useEffect } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
export function usePaymentOptions() {
  const { data, mutate } = useSWR("/api/payment-options", (url) =>
    fetch(url).then((res) => res.json())
  );

  const supabase = createClient();

  // Subscribe to realtime updates for appointments
  useEffect(() => {
    const channel = supabase
      .channel("realtime-payment-options")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payment_options" },
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
