"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./style.css";
import login1 from "@/public/images/login-page-2.png";

// Demo credentials — replace with real auth later
const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "123456";

const Login: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Enter your username and password to continue.");
      return;
    }

    setIsSubmitting(true);

    // Simulate a brief auth check
    setTimeout(() => {
      if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
        router.push("/dashboard");
      } else {
        setError("That username or password isn't right. Try again.");
        setIsSubmitting(false);
      }
    }, 500);
  };

  return (
    <div className="login-page">
      <Image
        src={login1}
        alt=""
        fill
        priority
        className="login-page__image"
        sizes="100vw"
      />
      <div className="login-page__overlay" aria-hidden="true" />

      <div className="login-panel">
        <div className="login-card">
          <span className="login-card__ribbon" aria-hidden="true" />

          <div className="login-card__header">
            <span className="login-card__eyebrow">Personal Book Manager</span>
            <h1 className="login-card__title">Welcome back</h1>
            <p className="login-card__subtitle">
              Sign in to pick up right where you left off.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="login-form__field">
              <span className="login-form__label">Username</span>
              <input
                type="text"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="login-form__input"
              />
            </label>

            <label className="login-form__field">
              <span className="login-form__label">Password</span>
              <div className="login-form__password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="login-form__input"
                />
                <button
                  type="button"
                  className="login-form__toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {error && (
              <p className="login-form__error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="login-form__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>

            <p className="login-form__hint">
              Demo credentials — username <strong>admin</strong>, password{" "}
              <strong>123456</strong>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;