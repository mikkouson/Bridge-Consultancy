"use client";

import {
  Building2,
  GalleryVerticalEnd,
  LayoutDashboard,
  Receipt,
  Settings2,
  HandCoins,
  CreditCard,
  UserCog,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Bridge Consultancy",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Customers",
      url: "customers",
      icon: Building2,
    },
    {
      title: "Invoices",
      url: "invoices",
      icon: Receipt,
    },
    {
      title: "Services",
      url: "services",
      icon: HandCoins,
    },
    {
      title: "Payment Options",
      url: "payment-options",
      icon: CreditCard,
    },
    {
      title: "Users",
      url: "users",
      icon: UserCog,
    },
    {
      title: "Settings",
      url: "settings",
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
