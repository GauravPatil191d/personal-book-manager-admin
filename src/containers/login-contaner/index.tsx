"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Modal from "react-modal";
import "./style.css";
import bgCard from "@/public/images/background-card.png";
import centerCard from "@/public/images/center-card.png";

import { useLogin } from "@/context/login-context";
import { useUser } from "@/context/user-context";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */
interface RegisterForm {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

/* ──────────────────────────────────────────────
   Pre‑filled demo data
   ────────────────────────────────────────────── */
const PRE_FILLED: RegisterForm = {
  name: "Gaurav Patil",
  email: "gaurav@gmail.com",
  mobile: "9876543210",
  password: "Password@123",
};

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */
const Login: React.FC = () => {
  const router = useRouter();
  const { loginContext } = useLogin();
  const { createUserContext } = useUser();

  /* ---- Login state ---- */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---- Register modal state ---- */
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regForm, setRegForm] = useState<RegisterForm>({ ...PRE_FILLED });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState("");
  const [isRegSubmitting, setIsRegSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  /* ---- Set react-modal app element (client only) ---- */
  useEffect(() => {
    if (typeof window !== "undefined") {
      Modal.setAppElement(document.body);
    }
  }, []);

  /* ────────────────────────────────────────────
     Login handlers
     ──────────────────────────────────────────── */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      await loginContext(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || err?.error || "Invalid email or password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ────────────────────────────────────────────
     Register handlers
     ──────────────────────────────────────────── */
  const openRegister = () => {
    setRegForm({ ...PRE_FILLED });
    setShowRegPassword(false);
    setRegError("");
    setRegSuccess(false);
    setIsRegSubmitting(false);
    setIsRegisterOpen(true);
  };

  const closeRegister = () => {
    if (isRegSubmitting) return; // prevent close while submitting
    setIsRegisterOpen(false);
  };

  const updateRegField = (field: keyof RegisterForm, value: string) => {
    setRegForm((prev) => ({ ...prev, [field]: value }));
    if (regError) setRegError("");
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRegError("");

    const { name, email: regEmail, mobile, password: regPassword } = regForm;

    if (!name.trim() || !regEmail.trim() || !mobile.trim() || !regPassword.trim()) {
      setRegError("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail)) {
      setRegError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(mobile.replace(/\s/g, ""))) {
      setRegError("Please enter a valid 10‑digit mobile number.");
      return;
    }

    if (regPassword.length < 6) {
      setRegError("Password must be at least 6 characters.");
      return;
    }

    setIsRegSubmitting(true);

    try {
      await createUserContext(name, regEmail, mobile, regPassword);

      setRegSuccess(true);

      setTimeout(() => {
        setIsRegisterOpen(false);
        setEmail(regEmail);
        setPassword("");
      }, 1500);
    } catch (err: any) {
      setRegError(
        typeof err === "string"
          ? err
          : err?.message || err?.error || "Registration failed. Please try again."
      );
    } finally {
      setIsRegSubmitting(false);
    }
  };

  /* ────────────────────────────────────────────
     Render
     ──────────────────────────────────────────── */
  return (
    <div className="login-page">
      {/* Background */}
      <Image
        src={bgCard}
        alt=""
        fill
        priority
        className="login-bg"
        sizes="100vw"
      />

      {/* Dark overlay */}
      <div className="login-overlay" aria-hidden="true" />

      {/* Card container */}
      <div className="login-card-wrapper">
        <div className="login-card">
          {/* Artwork */}
          <Image
            src={centerCard}
            alt=""
            fill
            priority
            className="login-card-image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
          />

          {/* Login form */}
          <div className="login-form-container">
            <div className="login-form-inner">
              <h1 className="login-heading">
                Welcome Back
                <span className="login-subheading">
                  Continue your reading journey
                </span>
              </h1>

              <form className="login-form" onSubmit={handleSubmit} noValidate>
                <div className="login-field">
                  <label htmlFor="email" className="login-label">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gmail.com"
                    className="login-input"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="login-field">
                  <label htmlFor="password" className="login-label">
                    Password
                  </label>
                  <div className="login-password-wrap">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="•••••••••••"
                      className="login-input login-input--password"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      className="login-eye"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      tabIndex={-1}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="login-eye__icon"
                      >
                        {showPassword ? (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </>
                        ) : (
                          <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="login-options">
                  <label className="login-remember">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="login-remember__checkbox"
                      disabled={isSubmitting}
                    />
                    <span className="login-remember__box" aria-hidden="true">
                      {rememberMe && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span className="login-remember__text">Remember Me</span>
                  </label>

                  <a href="/forgot-password" className="login-forgot">
                    Forgot Password?
                  </a>
                </div>

                {error && (
                  <p className="login-error" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="login-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in…" : "Sign In"}
                </button>
              </form>

              <p className="login-register">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="login-register__link"
                  onClick={openRegister}
                >
                  Create one
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────
          Registration Modal (react‑modal)
          ────────────────────────────────────────── */}
      <Modal
        isOpen={isRegisterOpen}
        onRequestClose={closeRegister}
        shouldCloseOnOverlayClick={!isRegSubmitting}
        shouldCloseOnEsc={!isRegSubmitting}
        closeTimeoutMS={250}
        className="register-modal-content"
        overlayClassName="register-modal-overlay"
        bodyOpenClassName="register-modal--body-open"
      >
        {/* Close button */}
        <button
          type="button"
          className="register-modal-close"
          onClick={closeRegister}
          disabled={isRegSubmitting}
          aria-label="Close registration form"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Modal inner */}
        <div className="register-modal-inner">
          <h2 className="register-modal-heading">
            Create Your Account
            <span className="register-modal-subheading">
              Join our reading community
            </span>
          </h2>

          {regSuccess ? (
            /* Success state */
            <div className="register-success">
              <div className="register-success__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <p className="register-success__text">Registration successful!</p>
              <p className="register-success__hint">Redirecting you to login…</p>
            </div>
          ) : (
            /* Registration form */
            <form
              className="register-form"
              onSubmit={handleRegisterSubmit}
              noValidate
            >
              {/* Name */}
              <div className="login-field">
                <label htmlFor="reg-name" className="login-label">
                  Full Name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={regForm.name}
                  onChange={(e) => updateRegField("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="login-input"
                  disabled={isRegSubmitting}
                />
              </div>

              {/* Email */}
              <div className="login-field">
                <label htmlFor="reg-email" className="login-label">
                  Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={regForm.email}
                  onChange={(e) => updateRegField("email", e.target.value)}
                  placeholder="you@example.com"
                  className="login-input"
                  disabled={isRegSubmitting}
                />
              </div>

              {/* Mobile */}
              <div className="login-field">
                <label htmlFor="reg-mobile" className="login-label">
                  Mobile Number
                </label>
                <input
                  id="reg-mobile"
                  type="tel"
                  name="mobile"
                  autoComplete="tel"
                  value={regForm.mobile}
                  onChange={(e) => updateRegField("mobile", e.target.value)}
                  placeholder="10‑digit mobile number"
                  className="login-input"
                  disabled={isRegSubmitting}
                  maxLength={10}
                />
              </div>

              {/* Password */}
              <div className="login-field">
                <label htmlFor="reg-password" className="login-label">
                  Password
                </label>
                <div className="login-password-wrap">
                  <input
                    id="reg-password"
                    type={showRegPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    value={regForm.password}
                    onChange={(e) => updateRegField("password", e.target.value)}
                    placeholder="Create a strong password"
                    className="login-input login-input--password"
                    disabled={isRegSubmitting}
                  />
                  <button
                    type="button"
                    className="login-eye"
                    onClick={() => setShowRegPassword((prev) => !prev)}
                    aria-label={
                      showRegPassword ? "Hide password" : "Show password"
                    }
                    tabIndex={-1}
                    disabled={isRegSubmitting}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="login-eye__icon"
                    >
                      {showRegPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Error */}
              {regError && (
                <p className="login-error" role="alert">
                  {regError}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="login-submit register-submit"
                disabled={isRegSubmitting}
              >
                {isRegSubmitting ? "Creating account…" : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Login;