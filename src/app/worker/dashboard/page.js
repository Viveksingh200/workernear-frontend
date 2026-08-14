"use client";

import { API_BASE_URL } from "@/config";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/authContext";
import { useLanguage } from "@/context/languageContext";
import { DashboardSkeleton, ReviewCardSkeleton } from "@/components/Skeletons";
import {
  User,
  ShieldAlert,
  Star,
  Eye,
  Sparkles,
  CheckCircle,
  Settings,
  TrendingUp,
  ArrowRight,
  MessageSquare,
  MousePointerClick
} from "lucide-react";

export default function WorkerDashboard() {
  const { user, workerProfile, loading, updateProfileState } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect non-workers
  useEffect(() => {
    if (!loading && (!user || user.role !== "provider")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Fetch reviews on mount
  useEffect(() => {
    if (workerProfile) {
      const fetchMyReviews = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/reviews/worker/${workerProfile._id}`);
          const data = await res.json();
          if (data.success) {
            setReviews(data.reviews);
          }
        } catch (err) {
          console.error("Failed to load worker reviews:", err);
        } finally {
          setLoadingReviews(false);
        }
      };
      fetchMyReviews();
    }
  }, [workerProfile]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return <DashboardSkeleton />;
  }

  const profile = workerProfile || {
    name: user.name || "Provider",
    profession: "Pending Setup",
    availability: "Available",
    profileCompletion: 0,
    approved: false,
    profileViews: 0,
    rating: 0,
    rankingScore: 0
  };

  const isProfileIncomplete =
    !profile.profession ||
    profile.profession === "Pending Setup" ||
    profile.profession.trim() === "";

  // Handle availability update
  const handleAvailabilityChange = async (newStatus) => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`${API_BASE_URL}/workers/availability`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ availability: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        updateProfileState({ ...workerProfile, availability: data.availability, rankingScore: data.rankingScore });
        setSuccess("Availability status updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update availability status.");
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full animate-fadeIn">
        {/* Top welcome banner with Speech-Bubble Onboarding Guide */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-md relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
                {language === "hi" ? "व्यावसायिक पैनल" : "Professional Panel"}
              </span>

              <h1 className="text-3xl font-black tracking-tight mt-2.5">
                {language === "hi" ? `नमस्ते, ${profile.name}` : `Welcome back, ${profile.name}`}
              </h1>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed max-w-md">
                {language === "hi"
                  ? "अपने सेवा आंकड़ों की समीक्षा करें, उपलब्धता बदलें और ग्राहक प्रोफाइल प्रबंधित करें।"
                  : "Review your performance statistics, update your booking availability, and manage your account details."}
              </p>
            </div>

            {/* Action button container with Tapping Hand Cursor placed directly OVER the button */}
            <div className="relative self-stretch md:self-auto flex flex-col items-stretch md:items-end pt-2 md:pt-0">
              {isProfileIncomplete && (
                <div className="mb-3 flex items-center gap-1.5 self-center md:self-center">
                  <div className="text-amber-300 text-sm font-bold shadow-sm">
                    <span>
                      {language === "hi"
                        ? "स्वीकृति (Approval) पाने के लिए प्रोफ़ाइल बनाएं"
                        : "Create profile to get admin approval"}
                    </span>
                  </div>
                </div>
              )}

              <div className="relative group w-full md:w-auto">
                {isProfileIncomplete && (
                  <>
                    {/* Glowing button background aura */}
                    <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 opacity-80 blur-sm animate-pulse"></span>

                    {/* Expanding click ring animation */}
                    <span className="absolute inset-0 rounded-xl border-2 border-amber-300 animate-ping opacity-75 pointer-events-none"></span>

                    {/* High-Definition Pointer Hand Cursor placed directly OVER the button clicking repeatedly */}
                    <div className="absolute top-[115%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex items-center justify-center animate-tap-click">
                      <div className="relative">
                        {/* Synchronized Finger Click Ripple Wave */}
                        <span className="absolute -top-3 -left-3 w-10 h-10 rounded-full border-2 border-amber-300 bg-amber-400/80 animate-tap-ripple pointer-events-none"></span>

                        {/* Distinct Pointing Index Finger Hand Cursor SVG */}
                        <svg
                          className="w-14 h-14 drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 2C8.44772 2 8 2.44772 8 3V12L6.70711 10.7071C6.31658 10.3166 5.68342 10.3166 5.29289 10.7071C4.90237 11.0976 4.90237 11.7308 5.29289 12.1213L9.58579 16.4142C10.3359 17.1643 11.3536 17.5858 12.4142 17.5858H14.5858C16.7949 17.5858 18.5858 15.7949 18.5858 13.5858V9C18.5858 8.44772 18.1381 8 17.5858 8C17.0335 8 16.5858 8.44772 16.5858 9V11H15.5858V7.5C15.5858 6.94772 15.1381 6.5 14.5858 6.5C14.0335 6.5 13.5858 6.94772 13.5858 7.5V11H12.5858V6C12.5858 5.44772 12.1381 5 11.5858 5C11.0335 5 10.5858 5.44772 10.5858 6V11H9.58579V3C9.58579 2.44772 9.13807 2 8.58579 2H9Z"
                            fill="#FFFFFF"
                            stroke="#000000"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </>
                )}

                <button
                  onClick={() => router.push("/worker/profile")}
                  className={`relative w-full md:w-auto flex items-center justify-center gap-2.5 bg-white text-zinc-950 hover:bg-amber-50 font-black text-xs sm:text-sm px-7 py-4 rounded-xl cursor-pointer shadow-xl transition-all duration-200 hover:scale-[1.03] active:scale-95 border ${isProfileIncomplete ? "border-amber-300" : "border-zinc-200"
                    }`}
                >
                  <Settings className="h-4.5 w-4.5 text-orange-600 shrink-0" />
                  <span>
                    {isProfileIncomplete
                      ? (language === "hi" ? "प्रोफ़ाइल बनाएं और सेटिंग्स" : "Create Profile & Settings")
                      : (language === "hi" ? "प्रोफ़ाइल प्रबंधित करें" : "Edit Profile & Settings")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approval Banner (when profile complete but awaiting admin approval) */}
        {!isProfileIncomplete && !profile.approved && (
          <div className="bg-amber-50/90 border border-amber-200 text-amber-950 rounded-3xl p-6 mb-8 shadow-sm flex items-start gap-4 animate-fadeIn">
            <div className="p-3 bg-amber-100/80 rounded-2xl text-amber-600 shrink-0 mt-0.5">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <span className="bg-amber-200/60 text-amber-800 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                {language === "hi" ? "समीक्षाधीन" : "Under Admin Review"}
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-amber-950">
                {t.awaitingApprovalTitle || "Profile Submitted - Awaiting Admin Approval"}
              </h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                {t.awaitingApprovalDesc || "Thank you for submitting your profile! Your account details are under review by our team. Once approved, your services will appear in search results."}
              </p>
            </div>
          </div>
        )}

        {/* Global Notifications */}
        {error && (
          <div className="bg-red-50 text-red-655 text-xs font-semibold p-4 rounded-2xl mb-6 shadow-sm shadow-red-500/5">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 text-emerald-700 text-xs font-semibold p-4 rounded-2xl mb-6 shadow-sm shadow-emerald-500/5 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>{success}</span>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Metrics & Reviews */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Performance Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-3xl p-5 shadow-sm shadow-zinc-200/50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    {language === "hi" ? "प्रोफ़ाइल दृश्य" : "Profile Views"}
                  </p>
                  <h4 className="text-2xl font-black text-zinc-800 mt-1">{profile.profileViews || 0}</h4>
                </div>
                <div className="h-10 w-10 bg-zinc-100 rounded-xl flex items-center justify-center">
                  <Eye className="h-5 w-5 text-zinc-400" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-sm shadow-zinc-200/50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    {language === "hi" ? "औसत रेटिंग" : "Average Rating"}
                  </p>
                  <h4 className="text-2xl font-black text-zinc-800 mt-1">{profile.rating || "0.0"}</h4>
                </div>
                <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-sm shadow-zinc-200/50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    {language === "hi" ? "रैंकिंग स्कोर" : "Platform Score"}
                  </p>
                  <h4 className="text-2xl font-black text-zinc-800 mt-1">{profile.rankingScore || 0}</h4>
                </div>
                <div className="h-10 w-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-orange-650" />
                </div>
              </div>
            </div>

            {/* Quick Link Card to Profile Settings */}
            <div className="bg-white rounded-3xl p-6 shadow-sm shadow-zinc-200/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md hover:scale-[1.005] transition-all duration-200">
              <div>
                <h3 className="font-bold text-sm text-zinc-900">
                  {language === "hi" ? "अपनी व्यावसायिक जानकारी अपडेट करें" : "Update Professional Listings"}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {language === "hi" ? "स्थान, श्रेणियाँ और सेवा विवरण प्रबंधित करें।" : "Manage work areas, services categories, description & security password."}
                </p>
              </div>
              <button
                onClick={() => router.push("/worker/profile")}
                className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer self-end sm:self-center"
              >
                <span>Edit Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Reviews list panel */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm shadow-zinc-200/50">
              <h2 className="text-base font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <MessageSquare className="h-4.5 w-4.5 text-zinc-400" />
                <span>{language === "hi" ? "ग्राहक प्रतिक्रिया सूची" : "Customer Reviews"} ({reviews.length})</span>
              </h2>

              {loadingReviews ? (
                <div className="animate-pulse flex flex-col gap-4">
                  <div className="h-14 bg-zinc-100 rounded-2xl w-full"></div>
                  <div className="h-14 bg-zinc-100 rounded-2xl w-full"></div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xs text-zinc-400">
                    {language === "hi" ? "अभी तक कोई ग्राहक समीक्षा नहीं मिली है।" : "You have not received any customer reviews yet."}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {reviews.map((r, i) => (
                    <div key={r._id} className="pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <h4 className="font-bold text-xs text-zinc-800">{r.userId?.name || "Client"}</h4>
                          <p className="text-[9px] text-zinc-400 mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 shrink-0 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200"
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                      {r.comment && r.comment.trim() !== "" && (
                        <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-4 rounded-2xl mt-1">{r.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right column: Quick Controls */}
          <div className="flex flex-col gap-6">

            {/* Availability Switcher */}
            <div className="bg-white rounded-3xl p-6 shadow-sm shadow-zinc-200/50">
              <h3 className="font-extrabold text-[10px] text-zinc-400 uppercase tracking-wider mb-4">
                {language === "hi" ? "आपकी वर्तमान स्थिति" : "Availability Status"}
              </h3>

              <div className="flex flex-col gap-2">
                {["Available", "Busy", "Offline"].map((status) => {
                  const isActive = profile.availability === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleAvailabilityChange(status)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-bold transition-all cursor-pointer ${isActive
                        ? status === "Available"
                          ? "bg-emerald-100 text-emerald-800 shadow-sm"
                          : status === "Busy"
                            ? "bg-amber-100 text-amber-800 shadow-sm"
                            : "bg-zinc-200 text-zinc-800 shadow-sm"
                        : "bg-zinc-100 hover:bg-zinc-150/80 text-zinc-650"
                        }`}
                    >
                      <span>
                        {language === "hi"
                          ? status === "Available"
                            ? "उपलब्ध (Available)"
                            : status === "Busy"
                              ? "व्यस्त (Busy)"
                              : "ऑफ़लाइन (Offline)"
                          : status}
                      </span>
                      {isActive && <div className="h-2 w-2 rounded-full bg-current"></div>}
                    </button>
                  );
                })}
              </div>

              {!profile.approved && (
                <div className="mt-5 flex items-start gap-3 bg-red-50/50 p-4 rounded-2xl text-red-750">
                  <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <p className="font-bold">{language === "hi" ? "प्रोफ़ाइल स्वीकृति लंबित है" : "Profile Approval Pending"}</p>
                    <p className="mt-1 opacity-90">
                      {language === "hi"
                        ? "आपका प्रोफ़ाइल वर्तमान में व्यवस्थापक द्वारा समीक्षाधीन है। स्वीकृत होने के बाद आप खोज परिणामों में लाइव होंगे।"
                        : "Your profile is undergoing review by our administrators. You will rank in search results once approved."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Completion indicator */}
            <div className="bg-white rounded-3xl p-6 shadow-sm shadow-zinc-200/50">
              <h3 className="font-extrabold text-[10px] text-zinc-400 uppercase tracking-wider mb-4">
                {language === "hi" ? "प्रोफ़ाइल पूर्णता" : "Profile Completion"}
              </h3>

              <div className="flex justify-between items-center text-xs font-bold mb-2 text-zinc-700">
                <span>{language === "hi" ? "सत्यापन विवरण" : "Details Filled"}</span>
                <span>{profile.profileCompletion || 0}%</span>
              </div>
              <div className="w-full bg-zinc-150/70 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${profile.profileCompletion || 0}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-zinc-400 mt-3 leading-relaxed">
                {language === "hi"
                  ? "उच्च रैंकिंग स्कोर प्राप्त करने के लिए अपनी प्रोफ़ाइल में विवरण और फोटो जोड़ें।"
                  : "Fill in all fields (description, experience, photo) to achieve a higher platform ranking score."}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
