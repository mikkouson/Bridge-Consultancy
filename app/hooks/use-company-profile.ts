import { useEffect } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
export function useCustomerProfile({ id }: { id: string }) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/companies/profile?id=${id}`,
    (url) => fetch(url).then((res) => res.json())
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

  return { data, mutate, error, isLoading };
}
