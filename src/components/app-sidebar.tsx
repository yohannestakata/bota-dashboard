"use client";

import * as React from "react";
import {
  Frame,
  Map,
  PieChart,
  Settings2,
  LayoutDashboard,
  Building2,
  MapPin,
  Image as ImageIcon,
  MessageSquare,
  ListTree,
  Zap,
  Users,
  BarChart3,
  BirdIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
      name: "Bota Review",
      logo: BirdIcon,
      plan: "Admin",
    },
    {
      name: "Bota Moderator",
      logo: BirdIcon,
      plan: "Review Moderator",
    },
    {
      name: "Bota Editor",
      logo: BirdIcon,
      plan: "Content Editor",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Places",
      url: "/places",
      icon: Building2,
      items: [
        { title: "All Places", url: "/places" },
        { title: "Categories", url: "/places/categories" },
        { title: "Cuisines", url: "/places/cuisines" },
      ],
    },
    {
      title: "Branches",
      url: "/branches",
      icon: MapPin,
      items: [
        { title: "All Branches", url: "/branches" },
        { title: "Hours", url: "/branches/hours" },
        { title: "Amenities", url: "/branches/amenities" },
        { title: "Menus", url: "/branches/menus" },
      ],
    },
    {
      title: "Media",
      url: "/media",
      icon: ImageIcon,
      items: [
        { title: "Place Photos", url: "/media/place-photos" },
        { title: "Branch Photos", url: "/media/branch-photos" },
        { title: "Review Photos", url: "/media/review-photos" },
        { title: "Menu Item Photos", url: "/media/menu-item-photos" },
      ],
    },
    {
      title: "Reviews",
      url: "/reviews",
      icon: MessageSquare,
      items: [
        { title: "Moderation Queue", url: "/reviews/moderation" },
        { title: "Recent Reviews", url: "/reviews/recent" },
      ],
    },
    {
      title: "Requests",
      url: "/requests",
      icon: ListTree,
      items: [
        { title: "Add Requests", url: "/requests/add" },
        { title: "Edit Requests", url: "/requests/edit" },
      ],
    },
    {
      title: "Featured",
      url: "/featured",
      icon: Zap,
      items: [
        { title: "Featured Places", url: "/featured" },
        { title: "Refresh/Jobs", url: "/featured/jobs" },
      ],
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
      items: [{ title: "Profiles", url: "/users" }],
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
      items: [{ title: "Activity & Trends", url: "/analytics" }],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        { title: "General", url: "/settings" },
        { title: "Integrations", url: "/settings/integrations" },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a
                href="https://botareview.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BirdIcon className="!size-5" />
                <span className="text-base font-semibold">Bota Review</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
