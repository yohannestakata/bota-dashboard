"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useTheme } from "next-themes";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | undefined>();
  const captchaRef = useRef<HCaptcha | null>(null);
  const { theme } = useTheme();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken },
    });
    try {
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(undefined);
    } catch {}
    setLoading(false);
    if (error) {
      setError(error.message);
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back");
    try {
      const params = new URLSearchParams(window.location.search);
      const dest = params.get("redirect") || "/";
      // Force a full reload so middleware sees fresh auth cookies
      if (dest.startsWith("http")) {
        window.location.assign(dest);
      } else {
        window.location.assign(dest);
      }
    } catch {
      // Fallback to client navigation
      router.replace("/");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="https://botareview.com"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <Image
                src="https://botareview.com/logo-icon-and-wordmark.svg"
                alt="Bota Review"
                width={120}
                height={28}
                priority
              />
              <span className="sr-only">Bota Review</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome to Bota Review Admin</h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Admin sign up
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="t@botareview.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="https://botareview.com/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <HCaptcha
              ref={captchaRef}
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ""}
              onVerify={(token) => setCaptchaToken(token)}
              theme={theme as "light" | "dark"}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <Link href="https://botareview.com/terms-of-service">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="https://botareview.com/privacy-policy">Privacy Policy</Link>
        .
      </div>
    </div>
  );
}
