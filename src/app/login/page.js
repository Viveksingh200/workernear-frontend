"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { useLanguage } from "@/context/languageContext";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!phone || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const res = await login(phone, password);
    if (res.success) {
      // Role-based redirection
      const userRole = res.user.role;
      if (userRole === "admin") {
        router.push("/admin");
      } else if (userRole === "provider") {
        router.push("/worker/dashboard");
      } else {
        router.push("/");
      }
    } else {
      setError(res.message || "Invalid phone number or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-zinc-100">
      <div className="bg-white px-8 py-10 rounded-xl shadow-sm w-full max-w-md border border-zinc-200/50">
        
        {/* form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <div className="flex flex-col justify-center gap-1">
            <h2 className="font-bold text-3xl mx-auto text-zinc-900">{t.welcomeBack}</h2>
            <p className="text-zinc-400 md:text-sm text-xs text-center">
              {t.loginSubtitle}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* input form */}
          <div className="flex flex-col mt-1">
            <label htmlFor="phone" className="text-zinc-700 font-semibold text-sm">
              {t.phoneNumber}
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
              className="px-4 py-2 mt-2 border border-zinc-200 rounded-md outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm text-zinc-900 placeholder-zinc-400"
              required
            />
            
            <label htmlFor="password" className="pt-4 text-zinc-700 font-semibold text-sm">
              {t.password}
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className="w-full px-4 py-2 pr-10 border border-zinc-200 rounded-md outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm text-zinc-900 placeholder-zinc-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer flex items-center"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg px-4 py-2.5 text-base tracking-wide font-semibold cursor-pointer shadow-md shadow-orange-500/10 hover:shadow-orange-500/25 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging In..." : t.login}
          </button>

          <p className="text-xs text-zinc-500 self-center font-medium">
            {t.dontHaveAccount}
            <Link href="/register" className="text-orange-600 hover:text-amber-600 font-bold hover:underline transition-colors ml-1">
              {t.register}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
