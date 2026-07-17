"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { createBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  KeyRound,
  Loader2,
  ArrowRight,
  Check,
} from "lucide-react";

type AuthMode = "login" | "signup" | "reset";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const has = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };
  const score = Object.values(has).filter(Boolean).length;
  const color =
    score <= 1
      ? "bg-destructive"
      : score <= 2
        ? "bg-orange-500"
        : score <= 3
          ? "bg-yellow-500"
          : score <= 4
            ? "bg-blue-500"
            : "bg-success";
  const label =
    score <= 1
      ? "Very Weak"
      : score <= 2
        ? "Weak"
        : score <= 3
          ? "Fair"
          : score <= 4
            ? "Good"
            : "Strong";

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full ${color} transition-all`}
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

export function PremiumAuth({ initialMode = "login" }: { initialMode?: AuthMode }) {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [data, setData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const validate = useCallback(
    (field: keyof FormData, value: string | boolean) => {
      if (field === "name" && mode === "signup" && !String(value).trim())
        return "Name is required";
      if (field === "email") {
        if (!String(value).trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)))
          return "Invalid email";
      }
      if (field === "password") {
        if (!value) return "Password is required";
        if (String(value).length < 8) return "At least 8 characters";
        if (mode === "signup") {
          const hasUpper = /[A-Z]/.test(String(value));
          const hasLower = /[a-z]/.test(String(value));
          const hasNumber = /[0-9]/.test(String(value));
          if (!hasUpper || !hasLower || !hasNumber) {
            return "Must include at least 1 uppercase letter, 1 lowercase letter, and 1 number";
          }
        }
      }
      if (field === "confirmPassword" && mode === "signup" && value !== data.password)
        return "Passwords do not match";
      if (field === "agreeToTerms" && mode === "signup" && !value)
        return "You must agree to the terms";
      return "";
    },
    [mode, data.password],
  );

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const err = validate(field, value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validate(field, data[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit called with mode:', mode);
    console.log('data:', data);
    const fields: (keyof FormData)[] =
      mode === "login"
        ? ["email", "password"]
        : ["name", "email", "password", "confirmPassword", "agreeToTerms"];
    const newErrors: FormErrors = {};
    fields.forEach((f) => {
      const err = validate(f, data[f]);
      console.log('Field', f, 'value:', data[f], 'error:', err);
      if (err) newErrors[f] = err;
    });
    console.log('newErrors:', newErrors);
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setErrors({});
    setSuccess("");

    try {
      console.log('Calling supabase auth function');
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      } else if (mode === "signup") {
        const { error, data: authData } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: { full_name: data.name },
            emailRedirectTo: `${appUrl}/signup/confirmation`,
          },
        });
        console.log('Sign up response:', { error, authData });
        if (error) throw error;
        setSuccess("Account created! Check your email to confirm.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(data.email);
        if (error) throw error;
        setSuccess("Password reset link sent!");
        setTimeout(() => setMode("login"), 2000);
      }
    } catch (err: unknown) {
      console.error('Error in handleSubmit:', err);
      setErrors({ general: err instanceof Error ? err.message : "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-6 shadow-2xl shadow-primary/5 backdrop-blur-xl">
        {/* Decorative gradient orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-1 -z-10 opacity-40"
        >
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-cta/15 blur-3xl" />
        </div>

        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-3 text-sm text-success">
            <Check className="h-4 w-4 shrink-0" />
            {success}
          </div>
        )}

        {errors.general && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {errors.general}
          </div>
        )}

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            {mode === "login"
              ? "Welcome back"
              : mode === "reset"
                ? "Reset password"
                : "Create your account"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "login"
              ? "Sign in to your Winning Ads AI account"
              : mode === "reset"
                ? "We'll send you a recovery link"
                : "Start discovering winning Meta ads"}
          </p>
        </div>

        {mode !== "reset" && (
          <div className="mb-6 flex rounded-xl bg-muted p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={cn(
                "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                mode === "login"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={cn(
                "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                mode === "signup"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Sign Up
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <FieldWrapper error={errors.name}>
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                name="name"
                type="text"
                placeholder="Full name"
                value={data.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                className="field-input"
                aria-label="Full name"
              />
            </FieldWrapper>
          )}

          <FieldWrapper error={errors.email}>
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              className="field-input"
              aria-label="Email"
            />
          </FieldWrapper>

          {mode !== "reset" && (
            <FieldWrapper error={errors.password}>
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={data.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                className="field-input"
                aria-label="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide" : "Show"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              {mode === "signup" && <PasswordStrength password={data.password} />}
            </FieldWrapper>
          )}

          {mode === "signup" && (
            <FieldWrapper error={errors.confirmPassword}>
              <Shield className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                value={data.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                onBlur={() => handleBlur("confirmPassword")}
                className="field-input"
                aria-label="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showConfirm ? "Hide" : "Show"}
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </FieldWrapper>
          )}

          {mode === "login" && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setMode("reset")}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Forgot password?
              </button>
            </div>
          )}

          {mode === "signup" && (
            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={data.agreeToTerms}
                onChange={(e) => handleChange("agreeToTerms", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-xs text-muted-foreground">
                I agree to the{" "}
                <span className="text-foreground">Terms</span> and{" "}
                <span className="text-foreground">Privacy Policy</span>
              </span>
            </label>
          )}
          {errors.agreeToTerms && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertTriangle className="h-3 w-3" />
              {errors.agreeToTerms}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === "login" ? (
              <>
                Sign in
                <ArrowRight className="h-4 w-4" />
              </>
            ) : mode === "reset" ? (
              <>
                <KeyRound className="h-4 w-4" />
                Send reset link
              </>
            ) : (
              <>
                Create account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {mode !== "reset" && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Don't have an account? " : "Already have one? "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="cursor-pointer font-medium text-foreground transition-colors hover:text-primary"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

function FieldWrapper({
  children,
  error,
}: {
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <div className="relative">{children}</div>
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
          <AlertTriangle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}
