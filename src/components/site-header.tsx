"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ui/theme-toggle";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export function SiteHeader() {
  const pathname = usePathname();
  const routeTitleMap: Record<string, string> = {
    "/": "Dashboard",
    "/places": "Places",
  };
  const fallbackTitle = (() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";
    const last = segments[segments.length - 1];
    return last.charAt(0).toUpperCase() + last.slice(1);
  })();
  const title = routeTitleMap[pathname] ?? fallbackTitle;
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Link
          href="/"
          aria-label="Bota Review"
          className="hidden sm:inline-flex items-center"
        >
          <Image
            src="https://botareview.com/logo-icon-and-wordmark.svg"
            alt="Bota Review"
            width={110}
            height={24}
            priority
          />
        </Link>
        <h1 className="text-base font-medium sm:ml-2">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
