import { useEffect } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function useSOA() {
  const router = useRouter();

  const { data, mutate, isLoading, error } = useSWR("/api/soa", (url) =>
    fetch(url).then((res) => res.json())
  );

  const supabase = createClient();

  useEffect(() => {
    if (error) {
      const statusCode = error.response?.status;
      router.push(`/errors/${statusCode || 500}`);
    }
  }, [error, router]);

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
