"use client";

import { API_BASE_URL } from "@/config";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/authContext";
import { useLanguage } from "@/context/languageContext";
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
  MessageSquare
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

  if (loading || !user || !workerProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-500 font-semibold animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

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
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full animate-fadeIn">
        {/* Top welcome banner */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
                {language === "hi" ? "व्यावसायिक पैनल" : "Professional Panel"}
              </span>
              <h1 className="text-3xl font-black tracking-tight mt-2.5">
                {language === "hi" ? `नमस्ते, ${workerProfile.name}` : `Welcome back, ${workerProfile.name}`}
              </h1>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed max-w-md">
                {language === "hi" 
                  ? "अपने सेवा आंकड़ों की समीक्षा करें, उपलब्धता बदलें और ग्राहक प्रोफाइल प्रबंधित करें।"
                  : "Review your performance statistics, update your booking availability, and manage your account details."}
              </p>
            </div>
            <button
              onClick={() => router.push("/worker/profile")}
              className="flex items-center gap-2 bg-white text-zinc-900 hover:bg-zinc-100 font-extrabold text-xs px-5 py-3 rounded-xl cursor-pointer shadow-sm transition-all"
            >
              <Settings className="h-4 w-4" />
              <span>{language === "hi" ? "प्रोफ़ाइल प्रबंधित करें" : "Edit Profile & Settings"}</span>
            </button>
          </div>
        </div>

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
                  <h4 className="text-2xl font-black text-zinc-800 mt-1">{workerProfile.profileViews || 0}</h4>
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
                  <h4 className="text-2xl font-black text-zinc-800 mt-1">{workerProfile.rating || "0.0"}</h4>
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
                  <h4 className="text-2xl font-black text-zinc-800 mt-1">{workerProfile.rankingScore || 0}</h4>
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
                    <div key={r._id} className="pb-6 mb-2">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <h4 className="font-bold text-xs text-zinc-800">{r.userId?.name || "Client"}</h4>
                          <p className="text-[9px] text-zinc-400 mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 shrink-0 ${
                                i < r.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-4 rounded-2xl mt-1">{r.comment || "(No text review)"}</p>
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
                  const isActive = workerProfile.availability === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleAvailabilityChange(status)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-bold transition-all cursor-pointer ${
                        isActive
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

              {!workerProfile.approved && (
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
                <span>{workerProfile.profileCompletion || 0}%</span>
              </div>
              <div className="w-full bg-zinc-150/70 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${workerProfile.profileCompletion || 0}%` }}
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
