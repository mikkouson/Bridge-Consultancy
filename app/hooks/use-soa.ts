import { useEffect } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
export function useSOA() {
  const { data, mutate, isLoading, error } = useSWR("/api/soa", (url) =>
    fetch(url).then((res) => res.json())
  );

  const supabase = createClient();

  // Subscribe to realtime updates for appointments
  useEffect(() => {
    const channel = supabase
      .channel("realtime-soa")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "statements" },
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
