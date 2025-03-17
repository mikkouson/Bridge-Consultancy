import { useEffect } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
export function useCompany() {
  const { data, mutate } = useSWR("/api/companies", (url) =>
    fetch(url).then((res) => res.json())
  );

  const supabase = createClient();

  // Subscribe to realtime updates for appointments
  useEffect(() => {
    const channel = supabase
      .channel("realtime-companies")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "companies" },
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
