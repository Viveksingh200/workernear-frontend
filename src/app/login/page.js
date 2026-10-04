"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { useLanguage } from "@/context/languageContext";
import { Eye, EyeOff } from "lucide-react";
import GoogleAuthButton from "@/components/GoogleAuthButton";

function LoginContent() {
  const { login } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const isAccountDeleted = searchParams.get("accountDeleted") === "true";

  const [role, setRole] = useState("user");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  React.useEffect(() => {
    if (isAccountDeleted) {
      setError(t.accountDeleted || "Your account has been deleted by an administrator.");
    }
  }, [isAccountDeleted, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowForgotPassword(false);
    setLoading(true);

    if (!identifier || !password) {
      setError("Please fill in all fields");
      setTimeout(() => setError(""), 5000);
      setLoading(false);
      return;
    }

    const res = await login(identifier, password);
    if (res.success) {
      const userRole = res.user.role;
      if (redirectUrl && redirectUrl.startsWith("/")) {
        window.location.replace(redirectUrl);
      } else if (userRole === "admin") {
        window.location.replace("/admin");
      } else if (userRole === "provider") {
        window.location.replace("/worker/dashboard");
      } else {
        window.location.replace("/");
      }
    } else {
      setError(res.message || "Invalid credentials. Please check your email/phone or password.");
      setTimeout(() => setError(""), 5000);
      if (res.message === "Invalid credentials!") {
        setShowForgotPassword(true);
      }
      setLoading(false);
    }
  };

  const registerLink = redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register";

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-zinc-100">
      <div className="bg-white px-8 py-8 sm:py-10 rounded-2xl shadow-sm w-full max-w-md border border-zinc-200/50">
        
        {/* form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5 w-full">
          <div className="flex flex-col justify-center gap-1">
            <h2 className="font-bold text-2xl sm:text-3xl mx-auto text-zinc-900">{t.welcomeBack}</h2>
            <p className="text-zinc-400 text-xs text-center">
              {t.loginSubtitle || "Enter your credentials or continue with Google"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="flex flex-col gap-1 mt-1">
            <div className="grid grid-cols-2 p-1 bg-zinc-100 rounded-lg border border-zinc-200 w-full">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`text-center py-2 px-2 text-xs font-bold rounded-md transition-all duration-200 cursor-pointer ${
                  role === "user"
                    ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {t.customer || "Customer"}
              </button>
              <button
                type="button"
                onClick={() => setRole("provider")}
                className={`text-center py-2 px-2 text-xs font-bold rounded-md transition-all duration-200 cursor-pointer ${
                  role === "provider"
                    ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {language === "hi" ? "वर्कर" : "Worker"}
              </button>
            </div>
          </div>

          {/* Quick Google Sign In */}
          <GoogleAuthButton
            role={role}
            redirectUrl={redirectUrl}
            text="Continue with Google"
            onError={(msg) => {
              setError(msg);
              setTimeout(() => setError(""), 6000);
            }}
          />

          {/* OR Divider */}
          <div className="relative flex items-center justify-center my-0.5">
            <div className="border-t border-zinc-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              OR
            </span>
            <div className="border-t border-zinc-200 w-full" />
          </div>

          {/* input form */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="identifier" className="text-zinc-700 font-semibold text-xs">
                {t.emailOrPhone || "Email or Phone Number"}
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={t.emailOrPhonePlaceholder || "name@example.com or phone number"}
                className="px-3.5 py-2 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-xs text-zinc-900 placeholder-zinc-400"
                required
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-zinc-700 font-semibold text-xs">
                {t.password}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full px-3.5 py-2 pr-10 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-xs text-zinc-900 placeholder-zinc-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer flex items-center"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {showForgotPassword && (
            <span className="flex justify-end w-full -mt-2">
              <Link href="/forgot-password" className="text-xs font-semibold text-amber-600 hover:text-orange-700 transition-colors">
                Forgot Password?
              </Link>
            </span>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg px-4 py-2.5 text-xs sm:text-sm tracking-wide font-semibold cursor-pointer shadow-md shadow-orange-500/10 hover:shadow-orange-500/25 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging In..." : t.login}
          </button>

          <p className="text-xs text-zinc-500 self-center font-medium">
            {t.dontHaveAccount}
            <Link href={registerLink} replace className="text-orange-600 hover:text-amber-600 font-bold hover:underline transition-colors ml-1">
              {t.register}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-zinc-100 text-xs font-semibold text-zinc-500">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
