import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Toaster } from "sonner";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://btouch.dev"),
  title: "btouch",
  description: "Developer identity cards with a physical sleeve, flip card profile, and live platform stats.",
  openGraph: {
    title: "btouch",
    description: "Shareable developer identity cards powered by live platform data.",
    siteName: "btouch",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var key = "btouch-ui-theme";
                  var stored = localStorage.getItem(key);
                  var theme = stored === "light" || stored === "dark"
                    ? stored
                    : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
                  document.documentElement.setAttribute("data-ui-theme", theme);
                  document.addEventListener("DOMContentLoaded", function () {
                    document.body.setAttribute("data-ui-theme", theme);
                  });
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
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
        className="antialiased"
      >
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
