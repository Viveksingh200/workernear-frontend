"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { useLanguage } from "@/context/languageContext";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user"); // "user" or "provider" (Worker)
  const [city, setCity] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [country, setCountry] = useState("United States");
  const [area, setArea] = useState("");

  const citiesByCountry = {
    "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Austin", "San Francisco", "Seattle"],
    "India": ["Mumbai", "Navi Mumbai", "Pune", "Delhi", "Bangalore"]
  };
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!name || !phone || !password) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    const finalCity = city === "Others" ? customCity : city;
    if (city === "Others" && !customCity.trim()) {
      setError("Please specify your custom city.");
      setLoading(false);
      return;
    }

    const payload = {
      name,
      phone,
      password,
      role,
      city: finalCity,
      area,
      country
    };

    const res = await register(payload);
    if (res.success) {
      setSuccess("Registration successful! Redirecting to login page...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setError(res.message || "Registration failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-zinc-100">
      <div className="bg-white px-6 py-6 sm:py-8 rounded-2xl shadow-md w-full max-w-md border border-zinc-200/50">
        
        {/* heading */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col justify-center gap-1 items-center">
            <h2 className="font-extrabold text-xl sm:text-2xl mx-auto text-zinc-900">{t.registerTitle}</h2>
            <p className="text-zinc-400 text-[11px] text-center">
              {t.registerSubtitle}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-[11px] font-semibold p-2.5 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 text-[11px] font-semibold p-2.5 rounded-lg border border-green-100">
              {success}
            </div>
          )}

          {/* input form */}
          <div className="flex flex-col mt-0.5 gap-2.5">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-zinc-700 font-bold text-xs">{t.fullName}</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="px-3 py-1.5 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-xs text-zinc-800"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="text-zinc-700 font-bold text-xs">
                {t.phoneNumber}
              </label>
              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="px-3 py-1.5 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-xs text-zinc-800"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-zinc-700 font-bold text-xs">
                {t.password}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full px-3 py-1.5 pr-9 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-xs text-zinc-800"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer flex items-center"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label htmlFor="country" className="text-zinc-700 font-bold text-xs">Country</label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setCity("");
                    setCustomCity("");
                  }}
                  className="px-3 py-1.5 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-xs bg-white text-zinc-800"
                  required
                >
                  <option value="United States">United States</option>
                  <option value="India">India</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="city" className="text-zinc-700 font-bold text-xs">{t.city}</label>
                <select
                  id="city"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    if (e.target.value !== "Others") {
                      setCustomCity("");
                    }
                  }}
                  className="px-3 py-1.5 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-xs bg-white text-zinc-800"
                  required
                >
                  <option value="">{t.cityPlaceholder}</option>
                  {(citiesByCountry[country] || []).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="Others">Other...</option>
                </select>
              </div>
            </div>

            {city === "Others" && (
              <div className="flex flex-col gap-1 animate-fadeIn">
                <label htmlFor="customCity" className="text-zinc-700 font-bold text-xs">Specify City</label>
                <input
                  id="customCity"
                  type="text"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  placeholder="Enter city name"
                  className="px-3 py-1.5 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-xs text-zinc-800"
                  required
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label htmlFor="area" className="text-zinc-700 font-bold text-xs">{t.area}</label>
              <input
                id="area"
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder={t.areaPlaceholder}
                className="px-3 py-1.5 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-xs text-zinc-800"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-zinc-700 font-bold text-xs">{t.role}</label>
              <div className="grid grid-cols-2 p-0.5 bg-zinc-100 rounded-lg border border-zinc-200 w-full">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`text-center py-1.5 px-2 text-[11px] font-extrabold rounded-md transition-all duration-200 cursor-pointer ${
                    role === "user"
                      ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  {language === "hi" ? "उपयोगकर्ता" : "Customer"}
                </button>
                <button
                  type="button"
                  onClick={() => setRole("provider")}
                  className={`text-center py-1.5 px-2 text-[11px] font-extrabold rounded-md transition-all duration-200 cursor-pointer ${
                    role === "provider"
                      ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  {language === "hi" ? "पेशेवर" : "Professional"}
                </button>
              </div>
              <p className="text-[9px] text-zinc-400 font-medium text-center">
                {role === "user"
                  ? (language === "hi" ? "आप अपने काम के लिए सेवा प्रदाता की तलाश में हैं।" : "For finding and booking local service providers.")
                  : (language === "hi" ? "आप अपनी सेवाएं सूचीबद्ध करना चाहते हैं।" : "For listing professional services and getting requests.")}
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold cursor-pointer shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Registering..." : t.register}
          </button>

          <p className="text-xs text-zinc-500 self-center font-medium">
            {t.alreadyHaveAccount}
            <Link href="/login" className="text-orange-600 hover:text-amber-600 font-bold hover:underline transition-colors ml-1">
              {t.login}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
