"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { CardData } from "@/types/card";

type Step = 1 | 2;
type PlatformKey = "github" | "leetcode" | "codeforces" | "gfg";
type FormState = {
  name: string;
  headline: string;
  bio: string;
  currentRole: string;
  currentCompany: string;
  linkedinUrl: string;
  github: string;
  leetcode: string;
  codeforces: string;
  gfg: string;
};

const monoFont = "var(--font-space-mono), monospace";
const groteskFont = "var(--font-space-grotesk), sans-serif";

const platforms: Array<{
  key: PlatformKey;
  label: string;
  color: string;
  rgb: string;
  prefix: string;
  placeholder: string;
}> = [
  {
    key: "github",
    label: "GITHUB",
    color: "#a78bfa",
    rgb: "167,139,250",
    prefix: "github.com/",
    placeholder: "your-username",
  },
  {
    key: "leetcode",
    label: "LEETCODE",
    color: "#f89f1b",
    rgb: "248,159,27",
    prefix: "leetcode.com/u/",
    placeholder: "your-handle",
  },
  {
    key: "codeforces",
    label: "CODEFORCES",
    color: "#5b8dd4",
    rgb: "91,141,212",
    prefix: "codeforces.com/profile/",
    placeholder: "your-handle",
  },
  {
    key: "gfg",
    label: "GFG",
    color: "#2ecc71",
    rgb: "46,204,113",
    prefix: "geeksforgeeks.org/user/",
    placeholder: "your-username",
  },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.03)",
  border: "0.5px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  color: "rgba(255,255,255,0.6)",
  fontFamily: monoFont,
  fontSize: 10,
  padding: "8px 11px",
  outline: "none",
  letterSpacing: "0.04em",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const emptyFormData: FormState = {
  name: "",
  headline: "",
  bio: "",
  currentRole: "",
  currentCompany: "",
  linkedinUrl: "",
  github: "",
  leetcode: "",
  codeforces: "",
  gfg: "",
};

type GitHubPreview = {
  avatar: string;
  name: string;
  repos: number;
} | null;

function validateLinkedIn(url: string) {
  if (!url) return "empty";
  if (url.includes("linkedin.com/in/")) return "valid";
  if (url.length > 5) return "invalid";
  return "typing";
}

function stripPlatformUrl(platform: string, value: string) {
  const prefixes: Record<string, string[]> = {
    github: ["https://github.com/", "github.com/"],
    leetcode: ["https://leetcode.com/u/", "leetcode.com/u/", "https://leetcode.com/", "leetcode.com/"],
    codeforces: ["https://codeforces.com/profile/", "codeforces.com/profile/"],
    gfg: ["https://www.geeksforgeeks.org/user/", "geeksforgeeks.org/user/"],
  };

  let clean = value.trim();
  for (const prefix of prefixes[platform] ?? []) {
    if (clean.startsWith(prefix)) {
      clean = clean.slice(prefix.length);
    }
  }

  return clean.replace(/\/$/, "");
}

function buildPreviewData(formData: FormState, avatarPreview: string | null): CardData {
  const linkedinUrl = formData.linkedinUrl.includes("linkedin.com") ? formData.linkedinUrl : null;
  const skills = [
    formData.github ? "GitHub" : null,
    formData.leetcode ? "LeetCode" : null,
    formData.codeforces ? "Codeforces" : null,
    formData.gfg ? "GFG" : null,
  ].filter((skill): skill is string => Boolean(skill));

  return {
    appearance: {
      theme: "dark",
      accentColor: "indigo",
    },
    profile: {
      displayName: formData.name.trim() || null,
      headline: formData.headline.trim() || null,
      bio: formData.bio.trim() || null,
      avatarUrl: avatarPreview,
      linkedinUrl,
      currentRole: formData.currentRole.trim() || null,
      currentCompany: formData.currentCompany.trim() || null,
      location: null,
      skills,
      openToWork: false,
      experience: formData.currentRole.trim() && formData.currentCompany.trim()
        ? [
            {
              role: formData.currentRole.trim(),
              company: formData.currentCompany.trim(),
              duration: null,
              description: null,
            },
          ]
        : [],
    },
    stats: {
      github: null,
      leetcode: null,
      codeforces: null,
      gfg: null,
      codechef: null,
    },
    config: {
      username: formData.name.trim().toLowerCase().replace(/\s+/g, "-") || "preview",
      showPlatforms: ["github", "leetcode", "codeforces", "gfg"],
      theme: "dark",
      accentColor: "indigo",
    },
    meta: {
      lastRefreshed: new Date().toISOString(),
      stalePlatforms: [],
    },
  };
}

interface OnboardingCardProps {
  onDataChange?: (data: CardData) => void;
}

export function OnboardingCard({ onDataChange }: OnboardingCardProps) {
  const router = useRouter();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const transitionTimeoutRef = useRef<number | null>(null);

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<FormState>(emptyFormData);
  const [githubPreview, setGithubPreview] = useState<GitHubPreview>(null);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const linkedinStatus = validateLinkedIn(formData.linkedinUrl);
  const canContinue = formData.name.trim().length >= 2 && linkedinStatus === "valid";

  const previewData = useMemo(() => buildPreviewData(formData, avatarPreview), [avatarPreview, formData]);

  useEffect(() => {
    onDataChange?.(previewData);
  }, [onDataChange, previewData]);

  useEffect(() => {
    setGithubPreview(null);

    if (!formData.github || formData.github.length < 2) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${formData.github}`);
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { avatar_url: string; name: string | null; login: string; public_repos: number };
        setGithubPreview({
          avatar: data.avatar_url,
          name: data.name ?? data.login,
          repos: data.public_repos,
        });
      } catch {
        setGithubPreview(null);
      }
    }, 600);

    return () => window.clearTimeout(timeoutId);
  }, [formData.github]);

  const triggerAvatarUpload = () => avatarInputRef.current?.click();

  const goToStep = (step: Step) => {
    if (step === currentStep) {
      return;
    }

    setIsTransitioning(true);
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = window.setTimeout(() => {
      setCurrentStep(step);
      setIsTransitioning(false);
    }, 150);
  };

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (isGenerating) {
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/card/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          avatarDataUrl: avatarPreview,
        }),
      });

      const data = (await response.json()) as { username?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to generate card.");
      }

      if (data.username) {
        router.push(`/${data.username}`);
      }
    } catch {
      setIsGenerating(false);
    }
  };

  return (
    <div
      style={{
        background: "#0d1117",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: 18,
        padding: "20px 20px 18px",
        width: "100%",
        maxWidth: 380,
        boxSizing: "border-box",
        boxShadow: "0 0 0 0.5px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(99,102,241,0.08)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: monoFont, fontSize: 9, fontWeight: 700, color: "#fff" }}>b</span>
          </div>
          <span
            style={{
              fontFamily: monoFont,
              fontSize: 10,
              fontWeight: 700,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.06em",
            }}
          >
            btouch
          </span>
        </div>
        <span
          style={{
            fontFamily: monoFont,
            fontSize: 8,
            color: "rgba(255,255,255,0.15)",
            letterSpacing: "0.1em",
          }}
        >
          build your card
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        {[1, 2].map((step) => (
          <div
            key={step}
            style={{
              height: 3,
              borderRadius: 2,
              transition: "all 0.3s",
              background: step === currentStep ? "#6366f1" : "rgba(255,255,255,0.1)",
              width: step === currentStep ? 24 : 12,
            }}
          />
        ))}
        <span
          style={{
            fontFamily: monoFont,
            fontSize: 8.5,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.12em",
            marginLeft: 4,
          }}
        >
          {currentStep === 1 ? "identity" : "platforms"}
        </span>
      </div>

      <div
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? "translateY(4px)" : "translateY(0)",
          transition: "opacity 0.15s, transform 0.15s",
        }}
      >
        {currentStep === 1 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                onClick={triggerAvatarUpload}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: avatarPreview ? "transparent" : "rgba(99,102,241,0.08)",
                  border: avatarPreview ? "none" : "1px dashed rgba(99,102,241,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                  overflow: "hidden",
                  transition: "all 0.2s",
                }}
              >
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="Avatar preview" width={52} height={52} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 16, marginBottom: 2 }}>+</div>
                    <div
                      style={{
                        fontFamily: monoFont,
                        fontSize: 7,
                        color: "rgba(99,102,241,0.5)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      photo
                    </div>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" ref={avatarInputRef} onChange={handleAvatarUpload} style={{ display: "none" }} />

              <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                className="btouch-input"
                style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    borderBottom: "0.5px solid rgba(255,255,255,0.1)",
                    color: "#f0f4ff",
                    fontFamily: groteskFont,
                    fontSize: 15,
                    fontWeight: 600,
                    padding: "4px 0",
                    outline: "none",
                    letterSpacing: "-0.01em",
                  }}
                />
                <input
                type="text"
                placeholder="Title · Company"
                value={formData.headline}
                onChange={(event) => setFormData((prev) => ({ ...prev, headline: event.target.value }))}
                className="btouch-input"
                style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    borderBottom: "0.5px solid rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.3)",
                    fontFamily: monoFont,
                    fontSize: 9,
                    padding: "5px 0",
                    outline: "none",
                    marginTop: 5,
                    letterSpacing: "0.04em",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(10,102,194,0.06)",
                border:
                  linkedinStatus === "invalid"
                    ? "0.5px solid rgba(239,68,68,0.3)"
                    : linkedinStatus === "valid"
                      ? "0.5px solid rgba(34,197,94,0.2)"
                      : "0.5px solid rgba(10,102,194,0.18)",
                borderRadius: 8,
                padding: "8px 10px",
              }}
            >
              <span
                style={{
                  fontFamily: monoFont,
                  fontSize: 9,
                  color: "#0A66C2",
                  flexShrink: 0,
                  letterSpacing: "0.04em",
                }}
              >
                in
              </span>
              <input
                type="text"
                placeholder="linkedin.com/in/your-handle"
                value={formData.linkedinUrl}
                onChange={(event) => setFormData((prev) => ({ ...prev, linkedinUrl: event.target.value }))}
                className="btouch-input"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: "#5a9fd4",
                  fontFamily: monoFont,
                  fontSize: 9,
                  outline: "none",
                  letterSpacing: "0.03em",
                }}
              />
              {linkedinStatus === "valid" && <span style={{ fontSize: 10, color: "#22c55e" }}>✓</span>}
            </div>
            {linkedinStatus === "invalid" ? (
              <div style={{ fontFamily: monoFont, fontSize: 8, color: "rgba(239,68,68,0.7)", letterSpacing: "0.06em", marginTop: 4 }}>
                paste your full linkedin.com/in/handle URL
              </div>
            ) : linkedinStatus === "valid" ? (
              <div style={{ fontFamily: monoFont, fontSize: 8, color: "rgba(34,197,94,0.7)", letterSpacing: "0.06em", marginTop: 4 }}>
                {"\u2713 valid linkedin URL"}
              </div>
            ) : null}

            <div style={{ position: "relative" }}>
              <textarea
                placeholder="Short bio — what you build, how you think..."
                value={formData.bio}
                maxLength={200}
                onChange={(event) => setFormData((prev) => ({ ...prev, bio: event.target.value }))}
                rows={2}
                className="btouch-input"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.02)",
                  border: "0.5px solid rgba(255,255,255,0.07)",
                  borderRadius: 8,
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: groteskFont,
                  fontWeight: 300,
                  fontSize: 11,
                  lineHeight: 1.65,
                  padding: "8px 10px 18px",
                  outline: "none",
                  resize: "none",
                  boxSizing: "border-box",
                  letterSpacing: "0.01em",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 6,
                  right: 8,
                  fontFamily: monoFont,
                  fontSize: 7.5,
                  color: formData.bio.length > 180 ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.15)",
                  letterSpacing: "0.06em",
                  pointerEvents: "none",
                }}
              >
                {formData.bio.length}/200
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <input
                type="text"
                placeholder="Current role"
                value={formData.currentRole}
                onChange={(event) => setFormData((prev) => ({ ...prev, currentRole: event.target.value }))}
                className="btouch-input"
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Company"
                value={formData.currentCompany}
                onChange={(event) => setFormData((prev) => ({ ...prev, currentCompany: event.target.value }))}
                className="btouch-input"
                style={inputStyle}
              />
            </div>

            <button
              onClick={() => goToStep(2)}
              disabled={!canContinue || isTransitioning}
              style={{
                width: "100%",
                padding: "10px 0",
                background: canContinue ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.04)",
                border: "0.5px solid",
                borderColor: canContinue ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.08)",
                borderRadius: 8,
                fontFamily: monoFont,
                fontSize: 10,
                color: canContinue ? "rgba(165,180,252,0.85)" : "rgba(255,255,255,0.2)",
                cursor: canContinue ? "pointer" : "not-allowed",
                letterSpacing: "0.1em",
                transition: "all 0.2s",
                marginTop: 2,
              }}
            >
              next → platforms
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {platforms.map((platform) => (
              <div
                key={platform.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: formData[platform.key]
                    ? `rgba(${platform.rgb},0.06)`
                    : "rgba(255,255,255,0.025)",
                  border: "0.5px solid",
                  borderColor: formData[platform.key] ? `rgba(${platform.rgb},0.2)` : "rgba(255,255,255,0.07)",
                  borderRadius: 8,
                  padding: "8px 10px",
                  transition: "all 0.2s",
                }}
              >
                <span
                  style={{
                    fontFamily: monoFont,
                    fontSize: 8,
                    color: platform.color,
                    letterSpacing: "0.1em",
                    flexShrink: 0,
                    minWidth: 72,
                    opacity: 0.8,
                  }}
                >
                  {platform.label}
                </span>
                <span
                  style={{
                    fontFamily: monoFont,
                    fontSize: 8.5,
                    color: "rgba(255,255,255,0.15)",
                    flexShrink: 0,
                  }}
                >
                  {platform.prefix}
                </span>
              <input
                type="text"
                placeholder={platform.placeholder}
                value={formData[platform.key]}
                onChange={(event) => setFormData((prev) => ({ ...prev, [platform.key]: event.target.value }))}
                onBlur={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    [platform.key]: stripPlatformUrl(platform.key, event.target.value),
                  }))
                }
                style={{
                  flex: 1,
                  background: "transparent",
                    border: "none",
                    color: platform.color,
                    fontFamily: monoFont,
                    fontSize: 9,
                    outline: "none",
                    letterSpacing: "0.03em",
                    minWidth: 0,
                }}
              />
                {formData[platform.key] ? <span style={{ fontSize: 10, color: "#22c55e", flexShrink: 0 }}>✓</span> : null}
              </div>
            ))}

            {githubPreview ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(167,139,250,0.06)",
                  border: "0.5px solid rgba(167,139,250,0.15)",
                  borderRadius: 6,
                  padding: "6px 10px",
                  marginTop: 4,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={githubPreview.avatar} alt="" style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: monoFont,
                    fontSize: 9,
                    color: "#a78bfa",
                    letterSpacing: "0.04em",
                  }}
                >
                  {githubPreview.name} · {githubPreview.repos} repos
                </span>
                <span style={{ fontSize: 10, color: "rgba(34,197,94,0.7)", marginLeft: "auto" }}>✓</span>
              </div>
            ) : null}

            <div
              style={{
                fontFamily: monoFont,
                fontSize: 8,
                color: "rgba(255,255,255,0.15)",
                letterSpacing: "0.06em",
                textAlign: "center",
                marginTop: 2,
              }}
            >
              all platforms optional · we fetch stats automatically
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button
                onClick={() => goToStep(1)}
                disabled={isTransitioning}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  background: "transparent",
                  border: "0.5px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  fontFamily: monoFont,
                  fontSize: 9,
                  color: "rgba(255,255,255,0.25)",
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                }}
              >
                ← back
              </button>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                style={{
                  flex: 2,
                  padding: "8px 0",
                  background: "linear-gradient(135deg,rgba(79,70,229,0.3),rgba(124,58,237,0.3))",
                  border: "0.5px solid rgba(99,102,241,0.4)",
                  borderRadius: 8,
                  fontFamily: monoFont,
                  fontSize: 10,
                  color: "rgba(165,180,252,0.9)",
                  cursor: "pointer",
                  letterSpacing: "0.1em",
                  fontWeight: 700,
                  opacity: isGenerating ? 0.8 : 1,
                }}
              >
                {isGenerating ? "generating..." : "generate my card →"}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        input:focus,
        textarea:focus {
          border-color: rgba(99, 102, 241, 0.3) !important;
        }

        .btouch-input:focus {
          border-color: rgba(99, 102, 241, 0.4) !important;
          background: rgba(99, 102, 241, 0.04) !important;
        }
      `}</style>
    </div>
  );
}
