"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  background: "rgba(255,255,255,0.025)",
  border: "0.5px solid rgba(255,255,255,0.07)",
  borderRadius: 8,
  color: "rgba(255,255,255,0.55)",
  fontFamily: monoFont,
  fontSize: 9,
  padding: "7px 10px",
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

export function OnboardingCard() {
  const router = useRouter();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const transitionTimeoutRef = useRef<number | null>(null);

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<FormState>(emptyFormData);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const linkedinIsValid = formData.linkedinUrl.includes("linkedin.com");
  const canContinue = formData.name.trim().length >= 2 && linkedinIsValid;

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
        width: 400,
        maxWidth: "100%",
        boxSizing: "border-box",
        boxShadow: "0 0 0 0.5px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(99,102,241,0.06)",
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
                border: linkedinIsValid || !formData.linkedinUrl ? "0.5px solid rgba(10,102,194,0.15)" : "0.5px solid rgba(239,68,68,0.3)",
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
              {linkedinIsValid && <span style={{ fontSize: 10, color: "#22c55e" }}>✓</span>}
            </div>
            {formData.linkedinUrl && !linkedinIsValid ? (
              <div style={{ marginTop: -4, fontFamily: monoFont, fontSize: 8, color: "#f87171", letterSpacing: "0.04em" }}>
                ✗ add full linkedin URL
              </div>
            ) : null}

            <textarea
              placeholder="Short bio — what you build, how you think..."
              value={formData.bio}
              onChange={(event) => setFormData((prev) => ({ ...prev, bio: event.target.value }))}
              rows={2}
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
                padding: "8px 10px",
                outline: "none",
                resize: "none",
                boxSizing: "border-box",
                letterSpacing: "0.01em",
              }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <input
                type="text"
                placeholder="Current role"
                value={formData.currentRole}
                onChange={(event) => setFormData((prev) => ({ ...prev, currentRole: event.target.value }))}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Company"
                value={formData.currentCompany}
                onChange={(event) => setFormData((prev) => ({ ...prev, currentCompany: event.target.value }))}
                style={inputStyle}
              />
            </div>

            <button
              onClick={() => goToStep(2)}
              disabled={!canContinue || isTransitioning}
              style={{
                width: "100%",
                padding: "9px 0",
                background: canContinue ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                border: "0.5px solid",
                borderColor: canContinue ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.08)",
                borderRadius: 8,
                fontFamily: monoFont,
                fontSize: 10,
                color: canContinue ? "rgba(165,180,252,0.8)" : "rgba(255,255,255,0.2)",
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
      `}</style>
    </div>
  );
}
