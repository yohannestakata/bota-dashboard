"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export default function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Avoid hydration mismatch by rendering a deterministic icon until mounted
  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme((isDark ? "light" : "dark") as "light" | "dark")}
    >
      {isDark ? <SunIcon size={24} /> : <MoonIcon size={24} />}
    </Button>
  );
}
