import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Godsfavour Blossom",
    template: "%s | Godsfavour Blossom",
  },
  description: "Godsfavour Blossom.",
  applicationName: "Godsfavour Blossom",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Godsfavour Blossom",
    description: "Co‑operative Society — Save little, borrow if needed, pay later.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-dvh bg-white text-slate-900 antialiased`}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}

