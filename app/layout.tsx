import type { Metadata } from "next";
import type { CSSProperties } from "react";
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
            "--font-inter": "system-ui, sans-serif",
            "--font-space-grotesk": "system-ui, sans-serif",
            "--font-jetbrains-mono": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            "--font-space-mono": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          } as CSSProperties
        }
        className="bg-surface text-white antialiased"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
