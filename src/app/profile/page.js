"use client";

import { API_BASE_URL } from "@/config";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/authContext";
import { useLanguage } from "@/context/languageContext";
import { User, Lock, Save, KeyRound, CheckCircle, Eye, EyeOff } from "lucide-react";

export default function UserProfile() {
  const { user, loading, logout, updateUserState, updateLocation } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Profile Form States
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password Reset Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Set user values
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setCity(user.city || "");
      setArea(user.area || "");
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-500 font-semibold animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  // Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileError("");
    setProfileSuccess("");

    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, city, area })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      updateUserState(data.user);
      updateLocation({ city: data.user.city, area: data.user.area });
      setProfileSuccess("Profile details updated successfully!");
      setTimeout(() => setProfileSuccess(""), 3000);
    } catch (err) {
      setProfileError(err.message || "Something went wrong.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Handle Password Change
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setUpdatingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match!");
      setUpdatingPassword(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      setUpdatingPassword(false);
      return;
    }

    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`${API_BASE_URL}/user/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      setPasswordSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (err) {
      setPasswordError(err.message || "Something went wrong.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-6 lg:px-8 py-10 w-full animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">
            {language === "hi" ? "मेरी प्रोफाइल सेटिंग्स" : "My Profile Settings"}
          </h1>
          <p className="text-xs text-zinc-400 font-semibold uppercase mt-1 tracking-wider">
            {language === "hi" ? "व्यक्तिगत जानकारी और सुरक्षा प्रबंधित करें" : "Manage your personal information and security"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card: Personal Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm shadow-zinc-200/50">
            <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-amber-500 shrink-0" />
              <span>{language === "hi" ? "व्यक्तिगत विवरण" : "Personal Information"}</span>
            </h2>

            {profileError && (
              <div className="bg-red-50 text-red-650 text-xs font-semibold p-4 rounded-2xl mb-4 shadow-sm shadow-red-500/5">
                {profileError}
              </div>
            )}
            {profileSuccess && (
              <div className="bg-emerald-50 text-emerald-700 text-xs font-semibold p-4 rounded-2xl mb-4 shadow-sm shadow-emerald-500/5 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>{profileSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-500">{t.fullName}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-500">{t.phoneNumber}</label>
                <input
                  type="text"
                  value={user.phone || ""}
                  disabled
                  className="px-4 py-2.5 bg-zinc-50 text-zinc-400 rounded-xl text-sm cursor-not-allowed"
                />
                <span className="text-[10px] text-zinc-400">
                  {language === "hi" ? "फोन नंबर बदला नहीं जा सकता।" : "Phone number cannot be changed."}
                </span>
              </div>



              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-500">{t.city}</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20 bg-white"
                  required
                >
                  <option value="">{t.cityPlaceholder}</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Navi Mumbai">Navi Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-500">{t.area}</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder={t.areaPlaceholder}
                  className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-950 text-white py-2.5 font-extrabold text-sm hover:from-zinc-950 hover:to-black shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{updatingProfile ? (language === "hi" ? "सहेज रहा है..." : "Saving...") : (language === "hi" ? "प्रोफ़ाइल सहेजें" : "Save Changes")}</span>
              </button>
            </form>
          </div>

          {/* Card: Reset/Change Password */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm shadow-zinc-200/50">
            <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-orange-600 shrink-0" />
              <span>{language === "hi" ? "पासवर्ड बदलें" : "Reset Password"}</span>
            </h2>

            {passwordError && (
              <div className="bg-red-50 text-red-650 text-xs font-semibold p-4 rounded-2xl mb-4 shadow-sm shadow-red-500/5">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="bg-emerald-50 text-emerald-700 text-xs font-semibold p-4 rounded-2xl mb-4 shadow-sm shadow-emerald-500/5 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-500">
                  {language === "hi" ? "वर्तमान पासवर्ड" : "Current Password"}
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-10 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer flex items-center"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-500">
                  {language === "hi" ? "नया पासवर्ड" : "New Password"}
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-10 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer flex items-center"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-500">
                  {language === "hi" ? "नए पासवर्ड की पुष्टि करें" : "Confirm New Password"}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-10 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer flex items-center"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingPassword}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2.5 font-extrabold text-sm hover:from-amber-600 hover:to-orange-700 shadow-md shadow-orange-500/10 hover:shadow-orange-500/25 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                <Lock className="h-4 w-4" />
                <span>{updatingPassword ? (language === "hi" ? "अपडेट हो रहा है..." : "Updating...") : (language === "hi" ? "पासवर्ड अपडेट करें" : "Update Password")}</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
