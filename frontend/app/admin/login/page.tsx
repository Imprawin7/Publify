"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/adminApi";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    setSubmitting(true);
    setError("");

    try {
      await login(
        String(data.get("email")),
        String(data.get("password"))
      );

      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="publify-login-page">
      <div className="publify-login-shell">
        <section className="publify-login-brand">
          <div className="publify-login-logo">P</div>

          <div>
            <div className="publify-login-name">Publify</div>
            <div className="publify-login-subtitle">
              Content Management
            </div>
          </div>
        </section>

        <section className="publify-login-card">
          <div className="publify-login-heading">
            <span>ADMINISTRATION</span>
            <h1>Welcome back</h1>
            <p>
              Sign in to manage your content and keep your website up to date.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="publify-login-form">
            <div className="publify-login-field">
              <label htmlFor="email">Email address</label>

              <div className="publify-login-input">
                <Mail size={17} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="publify-login-field">
              <label htmlFor="password">Password</label>

              <div className="publify-login-input">
                <LockKeyhole size={17} />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="publify-password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="publify-login-error">
                <strong>Unable to sign in</strong>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="publify-login-button"
            >
              <span>
                {submitting ? "Signing in..." : "Sign in"}
              </span>

              {!submitting && <ArrowRight size={17} />}
            </button>
          </form>
        </section>

        <footer className="publify-login-footer">
          <span>Publify CMS</span>
          <span>Secure administrator access</span>
        </footer>
      </div>
    </main>
  );
}