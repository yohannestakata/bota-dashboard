import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bota Review Dashboard",
  description: "Bota Review Dashboard",
  themeColor: "#0B0B0C",
  manifest: "https://botareview.com/site.webmanifest",
  icons: {
    icon: [
      {
        url: "https://botareview.com/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "https://botareview.com/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      { url: "https://botareview.com/favicon.ico" },
    ],
    apple: "https://botareview.com/apple-touch-icon.png",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster position="top-right" richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
