"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { saveCardConfig } from "@/app/dashboard/actions";
import type { CardData } from "@/types/card";
import { getAccentByName } from "@/lib/constants/accentColors";

export interface CardFormValues {
  username: string;
  displayName: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  currentRole: string;
  currentCompany: string;
  linkedinHandle: string;
  githubHandle: string;
  leetcodeHandle: string;
  cfHandle: string;
  gfgHandle: string;
  theme: "dark" | "light" | "auto";
  accentColor: string;
}

export interface CardFormValidation {
  username: { valid: boolean; error: string | null };
  displayName: { valid: boolean; error: string | null };
  headline: { valid: boolean; error: string | null };
  bio: { valid: boolean; error: string | null };
  avatarUrl: { valid: boolean; error: string | null };
  linkedinHandle: { valid: boolean; error: string | null };
  githubHandle: { valid: boolean; error: string | null };
  leetcodeHandle: { valid: boolean; error: string | null };
  cfHandle: { valid: boolean; error: string | null };
  gfgHandle: { valid: boolean; error: string | null };
}

interface UseCardFormArgs {
  initialPreview: CardData;
  storageKey: string;
}

interface SaveResult {
  ok: boolean;
  message: string;
}

function sanitizeHandle(value: string) {
  return value.trim().replace(/^@/, "").replace(/\/$/, "");
}

function stripLinkedInUrl(value: string) {
  return sanitizeHandle(value)
    .replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, "")
    .replace(/^linkedin\.com\/in\//i, "");
}

function stripPlatformHandle(value: string, prefixes: string[]) {
  let result = sanitizeHandle(value);
  for (const prefix of prefixes) {
    if (result.toLowerCase().startsWith(prefix.toLowerCase())) {
      result = result.slice(prefix.length);
      break;
    }
  }
  return result;
}

function parseStoredForm(value: string | null): CardFormValues | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<CardFormValues>;
    return {
      username: parsed.username ?? "",
      displayName: parsed.displayName ?? "",
      headline: parsed.headline ?? "",
      bio: parsed.bio ?? "",
      avatarUrl: parsed.avatarUrl ?? "",
      currentRole: parsed.currentRole ?? "",
      currentCompany: parsed.currentCompany ?? "",
      linkedinHandle: parsed.linkedinHandle ?? "",
      githubHandle: parsed.githubHandle ?? "",
      leetcodeHandle: parsed.leetcodeHandle ?? "",
      cfHandle: parsed.cfHandle ?? "",
      gfgHandle: parsed.gfgHandle ?? "",
      theme: parsed.theme === "light" || parsed.theme === "auto" ? parsed.theme : "dark",
      accentColor: parsed.accentColor || "Indigo",
    };
  } catch {
    return null;
  }
}

function buildFormFromPreview(preview: CardData): CardFormValues {
  return {
    username: preview.config.username ?? "",
    displayName: preview.profile.displayName ?? "",
    headline: preview.profile.headline ?? "",
    bio: preview.profile.bio ?? "",
    avatarUrl: preview.profile.avatarUrl ?? "",
    currentRole: preview.profile.currentRole ?? "",
    currentCompany: preview.profile.currentCompany ?? "",
    linkedinHandle: stripLinkedInUrl(preview.profile.linkedinUrl ?? ""),
    githubHandle: preview.stats.github?.handle ?? "",
    leetcodeHandle: preview.stats.leetcode?.handle ?? "",
    cfHandle: preview.stats.codeforces?.handle ?? "",
    gfgHandle: preview.stats.gfg?.handle ?? "",
    theme: preview.appearance.theme,
    accentColor: getAccentByName(preview.appearance.accentColor).name,
  };
}

function buildPreviewFromForm(form: CardFormValues, basePreview: CardData): CardData {
  return {
    ...basePreview,
    appearance: {
      theme: form.theme,
      accentColor: form.accentColor,
    },
    profile: {
      ...basePreview.profile,
      displayName: form.displayName.trim() || null,
      headline: form.headline.trim() || null,
      bio: form.bio.trim() || null,
      avatarUrl: form.avatarUrl.trim() || null,
      linkedinUrl: form.linkedinHandle.trim() ? `https://www.linkedin.com/in/${sanitizeHandle(form.linkedinHandle)}` : null,
      currentRole: form.currentRole.trim() || null,
      currentCompany: form.currentCompany.trim() || null,
    },
    config: {
      ...basePreview.config,
      username: form.username.trim() || basePreview.config.username,
      theme: form.theme,
      accentColor: form.accentColor,
    },
  };
}

function validateUrl(value: string) {
  if (!value.trim()) return { valid: false, error: null };

  try {
    const url = new URL(value);
    return { valid: url.protocol === "http:" || url.protocol === "https:", error: url.protocol === "http:" || url.protocol === "https:" ? null : "Use http or https." };
  } catch {
    return { valid: false, error: "Enter a valid URL." };
  }
}

function validateHandle(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, error: null };
  const ok = /^[a-zA-Z0-9._-]+$/.test(trimmed);
  return { valid: ok, error: ok ? null : "Use letters, numbers, periods, underscores, or hyphens." };
}

function validateHandleOrUrl(value: string, prefixes: string[]) {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, error: null };

  if (prefixes.some((prefix) => trimmed.toLowerCase().includes(prefix.toLowerCase()))) {
    return { valid: true, error: null };
  }

  return validateHandle(trimmed);
}

function validateRequired(value: string, min = 2, max = Infinity) {
  const trimmed = value.trim();
  if (trimmed.length < min) {
    return { valid: false, error: `At least ${min} characters.` };
  }
  if (trimmed.length > max) {
    return { valid: false, error: `Must be ${max} characters or less.` };
  }
  return { valid: true, error: null };
}

function validateOptional(value: string, max = Infinity) {
  const trimmed = value.trim();
  if (!trimmed) return { valid: true, error: null };
  if (trimmed.length > max) {
    return { valid: false, error: `Must be ${max} characters or less.` };
  }
  return { valid: true, error: null };
}

function buildValidation(form: CardFormValues): CardFormValidation {
  return {
    username: {
      ...validateRequired(form.username, 2, 39),
      error:
        !/^[a-zA-Z0-9-]+$/.test(form.username.trim()) && form.username.trim().length > 0
          ? "Use only letters, numbers, and hyphens."
          : validateRequired(form.username, 2, 39).error,
    },
    displayName: validateRequired(form.displayName, 2, 80),
    headline: validateOptional(form.headline, 120),
    bio: validateOptional(form.bio, 500),
    avatarUrl: validateUrl(form.avatarUrl),
    linkedinHandle: validateHandleOrUrl(form.linkedinHandle, ["linkedin.com/in/"]),
    githubHandle: validateHandleOrUrl(form.githubHandle, ["github.com/"]),
    leetcodeHandle: validateHandleOrUrl(form.leetcodeHandle, ["leetcode.com/"]),
    cfHandle: validateHandleOrUrl(form.cfHandle, ["codeforces.com/profile/"]),
    gfgHandle: validateHandleOrUrl(form.gfgHandle, ["geeksforgeeks.org/user/"]),
  };
}

function buildFormData(form: CardFormValues) {
  const data = new FormData();
  data.set("username", form.username.trim());
  data.set("displayName", form.displayName.trim());
  data.set("headline", form.headline.trim());
  data.set("bio", form.bio.trim());
  data.set("avatarUrl", form.avatarUrl.trim());
  data.set("currentRole", form.currentRole.trim());
  data.set("currentCompany", form.currentCompany.trim());
  data.set("linkedinHandle", sanitizeHandle(form.linkedinHandle));
  data.set("githubHandle", stripPlatformHandle(form.githubHandle, ["https://github.com/", "github.com/"]));
  data.set("leetcodeHandle", stripPlatformHandle(form.leetcodeHandle, ["https://leetcode.com/u/", "leetcode.com/u/", "https://leetcode.com/", "leetcode.com/"]));
  data.set("cfHandle", stripPlatformHandle(form.cfHandle, ["https://codeforces.com/profile/", "codeforces.com/profile/"]));
  data.set("gfgHandle", stripPlatformHandle(form.gfgHandle, ["https://www.geeksforgeeks.org/user/", "geeksforgeeks.org/user/"]));
  data.set("theme", form.theme);
  data.set("accentColor", form.accentColor.toLowerCase());
  return data;
}

function equals(a: CardFormValues, b: CardFormValues) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function useCardForm({ initialPreview, storageKey }: UseCardFormArgs) {
  const initialForm = useMemo(() => buildFormFromPreview(initialPreview), [initialPreview]);
  const [form, setForm] = useState<CardFormValues>(initialForm);
  const [previewData, setPreviewData] = useState<CardData>(initialPreview);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [saveState, setSaveState] = useState<SaveResult | null>(null);
  const committedRef = useRef<CardFormValues>(initialForm);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? parseStoredForm(window.localStorage.getItem(storageKey)) : null;
    if (stored) {
      setForm(stored);
      committedRef.current = stored;
      setPreviewData(buildPreviewFromForm(stored, initialPreview));
    }
    setIsHydrated(true);
  }, [initialPreview, storageKey]);

  useEffect(() => {
    if (!isHydrated) return;
    const id = window.setTimeout(() => {
      setPreviewData(buildPreviewFromForm(form, initialPreview));
    }, 300);
    return () => window.clearTimeout(id);
  }, [form, initialPreview, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(form));
  }, [form, isHydrated, storageKey]);

  const validation = useMemo(() => buildValidation(form), [form]);

  const accent = getAccentByName(form.accentColor);
  const hasChanges = !equals(form, committedRef.current);

  function updateField<K extends keyof CardFormValues>(key: K, value: CardFormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setIsSaving(true);
    const snapshot = form;
    try {
      const result = await saveCardConfig(buildFormData(snapshot));

      if (result.ok) {
        committedRef.current = snapshot;
        window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
        setSaveState(result);
      } else {
        setForm(committedRef.current);
        setPreviewData(buildPreviewFromForm(committedRef.current, initialPreview));
        setSaveState(result);
      }

      return result;
    } catch {
      const result = { ok: false, message: "Unable to save card right now." };
      setForm(committedRef.current);
      setPreviewData(buildPreviewFromForm(committedRef.current, initialPreview));
      setSaveState(result);
      return result;
    } finally {
      setIsSaving(false);
    }
  }

  async function refresh() {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/refresh", { method: "POST" });
      await new Promise((resolve) => window.setTimeout(resolve, 2000));
      return response.ok;
    } catch {
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }

  return {
    form,
    previewData,
    validation,
    accent,
    isHydrated,
    isSaving,
    isRefreshing,
    hasChanges,
    saveState,
    setForm,
    updateField,
    save,
    refresh,
    committedForm: committedRef.current,
    setSaveState,
  };
}

export type UseCardFormReturn = ReturnType<typeof useCardForm>;
