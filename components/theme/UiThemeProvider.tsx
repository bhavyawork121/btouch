"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type UiTheme = "dark" | "light";

interface UiThemeContextValue {
  uiTheme: UiTheme;
  setUiTheme: (theme: UiTheme) => void;
  toggleUiTheme: () => void;
}

const STORAGE_KEY = "btouch-ui-theme";

const UiThemeContext = createContext<UiThemeContextValue | null>(null);

function resolveInitialTheme(): UiTheme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: UiTheme) {
  document.documentElement.setAttribute("data-ui-theme", theme);
  document.body.setAttribute("data-ui-theme", theme);
}

export function UiThemeProvider({ children }: { children: React.ReactNode }) {
  const [uiTheme, setUiThemeState] = useState<UiTheme>("dark");

  useEffect(() => {
    const initialTheme = resolveInitialTheme();
    setUiThemeState(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const value = useMemo<UiThemeContextValue>(
    () => ({
      uiTheme,
      setUiTheme: (theme) => {
        setUiThemeState(theme);
        window.localStorage.setItem(STORAGE_KEY, theme);
        applyTheme(theme);
      },
      toggleUiTheme: () => {
        setUiThemeState((current) => {
          const next = current === "dark" ? "light" : "dark";
          window.localStorage.setItem(STORAGE_KEY, next);
          applyTheme(next);
          return next;
        });
      },
    }),
    [uiTheme],
  );

  return <UiThemeContext.Provider value={value}>{children}</UiThemeContext.Provider>;
}

export function useUiTheme() {
  const context = useContext(UiThemeContext);

  if (!context) {
    throw new Error("useUiTheme must be used within UiThemeProvider");
  }

  return context;
}
