"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.87-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39l4-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.61l4 3.11C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const supabase = createClient();

  const [error, setError] = useState<string | null>(null);

  const redirectTo =
    (typeof window !== "undefined" ? window.location.origin : "") +
    `/auth/callback?next=${encodeURIComponent(next)}`;

  const signInWithGoogle = async () => {
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    setStatus(error ? "error" : "sent");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 50% -10%, #FCE4E8 0%, #FDF3EF 55%, #F8E9E2 100%)",
        fontFamily: "system-ui, sans-serif",
        padding: 24,
      }}
    >
      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-rosegold/30 bg-white/70 p-8 text-center shadow-xl backdrop-blur-md">
        <div className="text-4xl flex justify-center items-center">
          <img
            src="/images/logo1.png"
            alt="Icon"
            style={{
              width: "50px",
              height: "50px",
              //objectFit: "contain",
            }}
            className="justify-center items-center"
          />
        </div>
        <div style={{ width: "100%", maxWidth: 360, textAlign: "center" }}>
          <h1
            //className="font-display text-2xl font-bold leading-tight text-wine sm:text-2xl"
            className="mt-3 font-display text-2xl font-bold text-wine"
            //style={{ fontSize: 28, marginBottom: 6, color: "#3A2430" }}
          >
            Welcome to BirthzMe. 🎂
          </h1>
          <p
            //className="mt-1 font-display text-2xl italic"
            //style={{ color: "#7A5766", marginBottom: 28, fontSize: 14 }}
            className="mt-2 font-display text-sm text-wine/70"
          >
            Sign in to create a birthday surprise.
          </p>

          {/* ── Background logo watermark ── */}
          <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none overflow-hidden">
            <div
              style={{
                width: "380px",
                height: "380px",
                opacity: 0.12, // 👈 0.035 වෙනුවට 0.10 - 0.15 අතර අගයක් දාලා බලන්න
                filter: "blur(0.5px)",
                transition: "all 0.9s ease",
              }}
            >
              <img
                src="/images/logo1.png"
                alt="Icon"
                style={{
                  width: "380px",
                  height: "380px",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>

          <button
            onClick={signInWithGoogle}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-rosegold/50 bg-white px-5 py-3 text-sm font-semibold text-ink shadow-sm transition hover:bg-blush"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-wine/40">
            <span className="h-px flex-1 bg-rosegold/30" />
            or
            <span className="h-px flex-1 bg-rosegold/30" />
          </div>

          {status === "sent" ? (
            <p style={{ color: "#7C1638", fontSize: 14, lineHeight: 1.6 }}>
              Check <strong>{email}</strong> for a sign-in link. You can close
              this tab.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 100,
                  border: "1px solid rgba(122,87,102,0.3)",
                  fontSize: 14,
                  outline: "none",
                  marginBottom: 14,
                }}
              />
              <button
                type="submit"
                disabled={status === "sending"}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  borderRadius: 100,
                  border: "none",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  background: "linear-gradient(135deg,#B8265A,#7C1638)",
                  opacity: status === "sending" ? 0.7 : 1,
                }}
              >
                {status === "sending" ? "Sending link..." : "Send magic link"}
              </button>
              {status === "error" && (
                <p style={{ color: "#B8265A", fontSize: 13, marginTop: 10 }}>
                  Something went wrong sending the link. Try again.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
