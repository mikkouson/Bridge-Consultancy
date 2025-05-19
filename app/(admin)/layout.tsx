import { AppSidebar } from "@/components/app-sidebar";
import ModeToggle from "@/components/theme";
import { createClient } from "@/utils/supabase/server";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userProps = user
    ? {
        name: user.user_metadata?.name || "",
        email: user.email || "",
        avatar: user.user_metadata?.avatar_url || "",
      }
    : { name: "", email: "", avatar: "" };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar user={userProps} />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />

            <ModeToggle />
          </header>
          <div className="flex-1 overflow-auto p-4">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
