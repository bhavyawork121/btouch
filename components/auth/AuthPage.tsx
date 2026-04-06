"use client";

import { useState, type FormEvent, type CSSProperties } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthPageProps {
  callbackUrl: string;
  googleEnabled: boolean;
}

export function AuthPage({ callbackUrl, googleEnabled }: AuthPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [manualForm, setManualForm] = useState({ name: "", email: "", password: "" });

  async function handleGoogleSignIn() {
    setError("");

    if (!googleEnabled) {
      setError("Google sign-in is not configured for this environment.");
      return;
    }

    const result = await signIn("google", { callbackUrl, redirect: false });
    if (result?.error) {
      setError("Google sign-in failed.");
      return;
    }

    router.push(result?.url ?? callbackUrl);
  }

  async function handleManualSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(manualForm),
    });

    const body = (await response.json()) as { error?: string };
    if (!response.ok) {
      setLoading(false);
      setError(body.error ?? "Unable to continue.");
      return;
    }

    const result = await signIn("credentials", {
      email: manualForm.email,
      password: manualForm.password,
      callbackUrl,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email or password is incorrect.");
      return;
    }

    router.push(result?.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100vh", background: "#05060a" }}>
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.18), transparent 30%), radial-gradient(circle at 80% 80%, rgba(34,197,94,0.12), transparent 26%)",
        }}
      >
        <section
          style={{
            padding: "64px 56px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "linear-gradient(135deg,#4f46e5,#22c55e)",
                }}
              />
              <span style={{ fontFamily: "var(--font-space-mono)", letterSpacing: "0.14em", fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
                btouch
              </span>
            </div>

            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)" }}>
              AUTH ACCESS
            </p>
            <h1 style={{ fontSize: "clamp(40px, 6vw, 76px)", lineHeight: 0.96, margin: "14px 0 18px", maxWidth: 560 }}>
              Google sign-in or classic email login.
            </h1>
            <p style={{ maxWidth: 540, color: "rgba(255,255,255,0.68)", lineHeight: 1.7, fontSize: 15 }}>
              Use Google for the fastest setup. Email and password will either sign you in or create a classic account the first time you use it.
            </p>
          </div>

          <div style={{ maxWidth: 520, marginTop: 32 }}>
            {error ? (
              <div style={errorStyle}>
                {error}
              </div>
            ) : null}
          </div>
        </section>

        <section style={{ padding: "56px 40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={cardStyle}>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              style={googleButtonStyle(googleEnabled)}
              disabled={!googleEnabled}
            >
              {googleEnabled ? "Continue with Google" : "Google sign-in not configured"}
            </button>

            <form onSubmit={handleManualSubmit} style={{ display: "grid", gap: 12 }}>
              <label style={labelStyle}>
                <span style={labelTextStyle}>Display name</span>
                <input
                  type="text"
                  placeholder="Optional on first use"
                  value={manualForm.name}
                  onChange={(event) => setManualForm((current) => ({ ...current, name: event.target.value }))}
                  style={fieldStyle}
                />
              </label>
              <label style={labelStyle}>
                <span style={labelTextStyle}>Email</span>
                <input
                  type="email"
                  required
                  value={manualForm.email}
                  onChange={(event) => setManualForm((current) => ({ ...current, email: event.target.value }))}
                  style={fieldStyle}
                />
              </label>
              <label style={labelStyle}>
                <span style={labelTextStyle}>Password</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={manualForm.password}
                  onChange={(event) => setManualForm((current) => ({ ...current, password: event.target.value }))}
                  style={fieldStyle}
                />
              </label>
              <button type="submit" disabled={loading} style={primaryButtonStyle}>
                {loading ? "Continuing..." : "Continue with email"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

const cardStyle: CSSProperties = {
  width: "100%",
  maxWidth: 460,
  borderRadius: 24,
  padding: 24,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 28px 80px rgba(0,0,0,0.35)",
  backdropFilter: "blur(20px)",
};

const googleButtonStyle = (enabled: boolean): CSSProperties => ({
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.12)",
  background: enabled ? "linear-gradient(135deg, rgba(66,133,244,0.2), rgba(16,185,129,0.16))" : "rgba(255,255,255,0.06)",
  color: "white",
  marginBottom: 20,
  opacity: enabled ? 1 : 0.55,
});

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 6,
};

const labelTextStyle: CSSProperties = {
  fontSize: 12,
  color: "rgba(255,255,255,0.72)",
};

const fieldStyle: CSSProperties = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  padding: "13px 14px",
  outline: "none",
};

const primaryButtonStyle: CSSProperties = {
  marginTop: 8,
  padding: "14px 16px",
  borderRadius: 14,
  border: "none",
  background: "linear-gradient(135deg, #4f46e5, #22c55e)",
  color: "white",
  fontWeight: 600,
};

const errorStyle: CSSProperties = {
  marginBottom: 14,
  padding: "10px 12px",
  borderRadius: 10,
  background: "rgba(239,68,68,0.12)",
  border: "1px solid rgba(239,68,68,0.3)",
  color: "#fecaca",
};
