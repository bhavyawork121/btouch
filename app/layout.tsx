import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Toaster } from "sonner";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://btouch.dev"),
  title: "btouch",
  description: "Animated developer identity cards with live coding stats.",
  openGraph: {
    title: "btouch",
    description: "Shareable developer flip cards powered by live platform data.",
    siteName: "btouch",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={
          {
            "--font-space-grotesk": '"Space Grotesk Variable", sans-serif',
            "--font-space-mono":
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
            "--font-inter": 'var(--font-space-grotesk)',
            "--font-jetbrains-mono": 'var(--font-space-mono)',
            "--font-geist-sans": 'var(--font-space-grotesk)',
            "--font-geist-mono": 'var(--font-space-mono)',
          } as CSSProperties
        }
        className="bg-[#0a0a0f] text-white antialiased"
      >
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
