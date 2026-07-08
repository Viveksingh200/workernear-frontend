"use client";

import { API_BASE_URL, getProfileImageUrl } from "@/config";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/authContext";
import { useLanguage } from "@/context/languageContext";
import { User, Lock, Save, KeyRound, CheckCircle, ArrowLeft, ShieldAlert, Camera, Trash2, Loader2, Navigation, Eye, EyeOff } from "lucide-react";

export default function WorkerProfilePage() {
  const { user, workerProfile, loading, updateProfileState, updateUserState, updateLocation } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  // Redirect if not logged in or not a provider
  useEffect(() => {
    if (!loading && (!user || user.role !== "provider")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Form states for profile details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [serviceAreas, setServiceAreas] = useState("");
  const [profession, setProfession] = useState("");
  const [experience, setExperience] = useState(0);
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [country, setCountry] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [saving, setSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [fetchingLocation, setFetchingLocation] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Set user and profile details on load
  useEffect(() => {
    if (workerProfile) {
      setName(workerProfile.name || "");
      setPhone(workerProfile.phone || "");
      setProfession(workerProfile.profession || "");
      setExperience(workerProfile.experience || 0);
      setDescription(workerProfile.description || "");
      setServiceAreas(workerProfile.serviceAreas?.join(", ") || "");
      setCity(workerProfile.city || "");
      setArea(workerProfile.area || "");
      setCountry(workerProfile.country || "");
      setProfileImage(workerProfile.profileImage || "");
    }
  }, [workerProfile]);

  // Fetch categories from database
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCats();
  }, []);

  // Sync category state once categories and profile are loaded
  useEffect(() => {
    if (workerProfile && categories.length > 0) {
      const firstCat = workerProfile.serviceCategories?.[0] || "";
      if (firstCat) {
        const isKnown = categories.some((c) => c.name.toLowerCase() === firstCat.toLowerCase());
        if (isKnown) {
          const matched = categories.find((c) => c.name.toLowerCase() === firstCat.toLowerCase());
          setSelectedCategory(matched.name);
          setCustomCategory("");
        } else {
          setSelectedCategory("Others");
          setCustomCategory(firstCat);
        }
      } else {
        setSelectedCategory("");
        setCustomCategory("");
      }
    }
  }, [workerProfile, categories]);

  // Handle File Upload and conversion to base64
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError(language === "hi" ? "फ़ाइल का आकार 5MB से कम होना चाहिए।" : "File size must be less than 5MB.");
      return;
    }

    setUploading(true);
    setUploadError("");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Data = reader.result;
      const token = localStorage.getItem("authToken");

      try {
        const res = await fetch(`${API_BASE_URL}/workers/upload-avatar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ image: base64Data })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to upload image");
        }

        setProfileImage(data.url);
      } catch (err) {
        console.error("Upload error:", err);
        setUploadError(err.message || (language === "hi" ? "अपलोड करने में विफल।" : "Failed to upload image."));
      } finally {
        setUploading(false);
      }
    };
  };

  // Drag and Drop handlers
  const [dragActive, setDragActive] = useState(false);
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const event = { target: { files: [file] } };
        await handleImageChange(event);
      } else {
        setUploadError(language === "hi" ? "कृपया केवल चित्र फ़ाइलें अपलोड करें।" : "Please upload image files only.");
      }
    }
  };

  if (loading || !user || !workerProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-500 font-semibold animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  // Handle Save Worker Profile details
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProfileError("");
    setProfileSuccess("");

    const token = localStorage.getItem("authToken");
    
    const finalCategory = selectedCategory === "Others" ? customCategory : selectedCategory;
    if (selectedCategory === "Others" && !customCategory.trim()) {
      setProfileError(language === "hi" ? "कृपया अपनी श्रेणी निर्दिष्ट करें।" : "Please specify your custom category.");
      setSaving(false);
      return;
    }

    const categoriesArray = finalCategory ? [finalCategory.trim()] : [];
    const areasArray = serviceAreas
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a !== "");

    try {
      const res = await fetch(`${API_BASE_URL}/workers/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          phone,
          profession,
          experience: parseInt(experience),
          description,
          serviceCategories: categoriesArray,
          serviceAreas: areasArray,
          city,
          area,
          country,
          profileImage
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      updateProfileState(data.worker);
      if (data.user) {
        updateUserState(data.user);
      }
      setProfileSuccess(
        language === "hi" 
          ? "व्यावसायिक प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!" 
          : "Professional profile updated successfully!"
      );
      updateLocation({ city: data.worker.city, area: data.worker.area });
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setProfileSuccess(""), 4000);
    } catch (err) {
      setProfileError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleAutoFetchLocation = () => {
    if (!navigator.geolocation) {
      setProfileError(language === "hi" ? "आपका ब्राउज़र स्थान का समर्थन नहीं करता है।" : "Geolocation is not supported by your browser.");
      return;
    }

    setFetchingLocation(true);
    setProfileError("");
    setProfileSuccess("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
          );
          const data = await response.json();
          const addr = data.address || {};
          let rawCity = addr.city || addr.town || addr.village || addr.state_district || addr.county || "";
          let rawArea = addr.suburb || addr.neighbourhood || addr.residential || addr.city_district || "";
          
          rawCity = rawCity.trim();
          rawArea = rawArea.trim();
          if (rawCity.toLowerCase().includes("mumbai")) {
            if (rawCity.toLowerCase().includes("navi") || rawArea.toLowerCase().includes("navi")) {
              rawCity = "Navi Mumbai";
            } else {
              rawCity = "Mumbai";
            }
          } else if (rawCity.toLowerCase().includes("delhi")) {
            rawCity = "Delhi";
          } else if (rawCity.toLowerCase().includes("pune")) {
            rawCity = "Pune";
          } else if (rawCity.toLowerCase().includes("bangalore") || rawCity.toLowerCase().includes("bengaluru")) {
            rawCity = "Bangalore";
          }
          
          setCity(rawCity);
          setArea(rawArea);
          setProfileSuccess(language === "hi" ? "स्थान सफलतापूर्वक प्राप्त किया गया!" : "Location coordinates successfully resolved!");
          setTimeout(() => setProfileSuccess(""), 4000);
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
          setProfileError(language === "hi" ? "स्थान पता करने में विफलता।" : "Failed to resolve GPS coordinates.");
        } finally {
          setFetchingLocation(false);
        }
      },
      (error) => {
        console.error("GPS fetching failed:", error);
        setProfileError(language === "hi" ? "स्थान की अनुमति अस्वीकृत की गई।" : "Geolocation access was denied or timed out.");
        setFetchingLocation(false);
      },
      { timeout: 8000 }
    );
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

      <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full animate-fadeIn">
        {/* Header & Back Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <button
              onClick={() => router.push("/worker/dashboard")}
              className="flex items-center gap-1.5 text-xs font-bold bg-zinc-150/80 hover:bg-zinc-200 text-zinc-650 hover:text-zinc-900 px-3.5 py-1.5 rounded-full transition-all mb-4 cursor-pointer shadow-sm w-fit"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900">
              {language === "hi" ? "व्यावसायिक प्रोफ़ाइल और सेटिंग्स" : "Professional Profile & Settings"}
            </h1>
            <p className="text-xs text-zinc-400 font-semibold uppercase mt-1 tracking-wider">
              {language === "hi" ? "सत्यापन विवरण, सेवा सूची और पासवर्ड प्रबंधित करें" : "Manage verification details, service listings and password"}
            </p>
          </div>
        </div>

        {/* Global Notifications */}
        {profileError && (
          <div className="bg-red-50 text-red-650 text-xs font-semibold p-4 rounded-2xl mb-6 shadow-sm shadow-red-500/5">
            {profileError}
          </div>
        )}
        {profileSuccess && (
          <div className="bg-emerald-50 text-emerald-755 text-emerald-700 text-xs font-semibold p-4 rounded-2xl mb-6 shadow-sm shadow-emerald-500/5 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>{profileSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel: Edit Profile details Form */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm shadow-zinc-200/50">
              <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
                
                {/* Section title: Personal Details */}
                <div>
                  <h3 className="font-black text-xs text-orange-600 tracking-wider uppercase mb-4">
                    {language === "hi" ? "1. व्यक्तिगत विवरण" : "1. Personal Information"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        value={phone}
                        disabled
                        className="px-4 py-2.5 bg-zinc-50 text-zinc-400 rounded-xl text-sm cursor-not-allowed"
                      />
                    </div>


                  </div>
                </div>

                {/* Section title: Professional Details */}
                <div className="mt-2">
                  <h3 className="font-black text-xs text-orange-600 tracking-wider uppercase mb-4">
                    {language === "hi" ? "2. व्यावसायिक विवरण" : "2. Professional Information"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">{language === "hi" ? "व्यवसाय" : "Profession"}</label>
                      <input
                        type="text"
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        placeholder="e.g. Electrician"
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">{language === "hi" ? "अनुभव (वर्षों में)" : "Experience (in Years)"}</label>
                      <input
                        type="number"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="e.g. 5"
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                        min="0"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2 text-left">
                      <label className="text-xs font-bold text-zinc-500">{language === "hi" ? "सेवा श्रेणी" : "Service Category"}</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          if (e.target.value !== "Others") {
                            setCustomCategory("");
                          }
                        }}
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20 bg-white"
                        required
                      >
                        <option value="">{language === "hi" ? "श्रेणी चुनें" : "Select Category"}</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                        <option value="Others">{language === "hi" ? "अन्य" : "Others"}</option>
                      </select>
                    </div>

                    {selectedCategory === "Others" && (
                      <div className="flex flex-col gap-1.5 md:col-span-2 text-left animate-fadeIn">
                        <label className="text-xs font-bold text-zinc-500">{language === "hi" ? "अपनी श्रेणी लिखें" : "Specify Other Category"}</label>
                        <input
                          type="text"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder={language === "hi" ? "उदा. कार वॉश" : "e.g. Car Wash"}
                          className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                          required
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-zinc-500">{language === "hi" ? "सेवा विवरण" : "Service Description"}</label>
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide details about your expertise..."
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                        required
                      />
                    </div>

                    <div className="md:col-span-2 text-left">
                      <button
                        type="button"
                        onClick={handleAutoFetchLocation}
                        disabled={fetchingLocation}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-amber-100 bg-amber-50 hover:bg-amber-100 text-amber-700 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {fetchingLocation ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Navigation className="h-3.5 w-3.5 shrink-0" />
                        )}
                        <span>{language === "hi" ? "स्वचालित स्थान प्राप्त करें" : "Auto Fetch Location"}</span>
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">Country</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20 bg-white"
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="United States">United States</option>
                        <option value="India">India</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">{language === "hi" ? "शहर" : "City"}</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Mumbai"
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                        required
                      />
                    </div>
 
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">{language === "hi" ? "लोकेशन/क्षेत्र" : "Area"}</label>
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="e.g. Belapur"
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-zinc-500">{language === "hi" ? "सेवा क्षेत्र (अल्पविराम से अलग करें)" : "Areas Served"}</label>
                      <input
                        type="text"
                        value={serviceAreas}
                        onChange={(e) => setServiceAreas(e.target.value)}
                        placeholder="e.g. Belapur, Seawoods"
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Section title: verification credentials */}
                <div className="mt-2">
                  <h3 className="font-black text-xs text-orange-600 tracking-wider uppercase mb-4">
                    {language === "hi" ? "3. सत्यापन एवं मीडिया" : "3. Identity Verification & Media"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs font-bold text-zinc-500">
                        {language === "hi" ? "प्रोफ़ाइल फोटो" : "Profile Photo"}
                      </label>
                      
                      <div className={`flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-zinc-50 border border-dashed hover:border-amber-500 transition-colors relative ${dragActive ? "border-amber-500 bg-amber-50/20" : "border-zinc-200"}`}>
                        {/* Drag overlay trigger */}
                        <div
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          className="absolute inset-0 z-10 rounded-2xl cursor-pointer"
                        />

                        {/* Preview and Edit button */}
                        <div className="relative group h-24 w-24 rounded-2xl border border-zinc-200 overflow-hidden bg-white shrink-0 flex items-center justify-center shadow-sm z-20">
                          {profileImage ? (
                            <img
                              src={getProfileImageUrl(profileImage)}
                              alt="Avatar Preview"
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-amber-50 text-amber-600 font-extrabold text-3xl">
                              {name ? name.charAt(0).toUpperCase() : <User className="h-8 w-8 text-amber-500" />}
                            </div>
                          )}

                          {uploading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white z-30">
                              <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                          )}
                          
                          {/* Hover edit camera overlay */}
                          <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20">
                            <Camera className="h-6 w-6 text-white" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              disabled={uploading}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* File Selector details / drag details */}
                        <div className="flex-1 text-center sm:text-left z-20">
                          <p className="text-xs font-bold text-zinc-700">
                            {uploading 
                              ? (language === "hi" ? "अपलोड किया जा रहा है..." : "Uploading image...") 
                              : (language === "hi" ? "खींचें और छोड़ें या ब्राउज़ करें" : "Drag & drop your photo or browse")}
                          </p>
                          <p className="text-[10px] text-zinc-400 mt-1">
                            {language === "hi" 
                              ? "JPEG, PNG, WebP सपोर्टेड। अधिकतम 5MB।" 
                              : "Supports JPG, PNG, or WebP. Max size 5MB."}
                          </p>
                          
                          <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
                            <label className="px-3.5 py-1.5 text-[11px] font-bold bg-white border border-zinc-200 text-zinc-700 rounded-lg shadow-sm hover:bg-zinc-50 cursor-pointer transition-colors">
                              <span>{language === "hi" ? "फोटो चुनें" : "Select File"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={uploading}
                                className="hidden"
                              />
                            </label>

                            {profileImage && (
                              <button
                                type="button"
                                onClick={() => setProfileImage("")}
                                className="text-[11px] font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>{language === "hi" ? "हटाएं" : "Remove"}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {uploadError && (
                        <p className="text-[10px] text-red-655 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 font-semibold w-fit mt-1">
                          {uploadError}
                        </p>
                      )}
                    </div>
                    
                  </div>
                </div>

                {profileError && (
                  <div className="bg-red-50 text-red-650 text-xs font-semibold p-4 rounded-2xl text-left border border-red-100 shadow-sm shadow-red-500/5">
                    {profileError}
                  </div>
                )}
                {profileSuccess && (
                  <div className="bg-emerald-50 text-emerald-700 text-xs font-semibold p-4 rounded-2xl text-left border border-emerald-100 flex items-center gap-2 animate-fadeIn shadow-sm shadow-emerald-500/5">
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{profileSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-950 text-white py-3 font-extrabold text-sm hover:from-zinc-950 hover:to-black shadow-md shadow-zinc-900/10 transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? (language === "hi" ? "सहेज रहा है..." : "Saving...") : (language === "hi" ? "विवरण सहेजें" : "Save Profile Details")}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Panel: Profile Verification alerts & Password Card */}
          <div className="flex flex-col gap-6">
            {/* Verification status card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm shadow-zinc-200/50">
              <h3 className="font-extrabold text-[10px] text-zinc-400 uppercase tracking-wider mb-4">
                {language === "hi" ? "सत्यापन की स्थिति" : "Verification Status"}
              </h3>

              <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${workerProfile.approved ? "bg-emerald-500" : "bg-red-500"}`} />
                <span className="text-xs font-bold">
                  {workerProfile.approved
                    ? (language === "hi" ? "प्रोफ़ाइल स्वीकृत और लाइव है" : "Profile Approved & Active")
                    : (language === "hi" ? "स्वीकृति लंबित है" : "Pending Administrator Review")}
                </span>
              </div>

              {!workerProfile.approved && (
                <div className="mt-4 flex items-start gap-2.5 bg-red-50/50 p-4 rounded-2xl text-red-750 text-[11px] leading-relaxed">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>
                    {language === "hi"
                      ? "समीक्षा के बाद व्यवस्थापक आपकी प्रोफ़ाइल स्वीकृत करेंगे।"
                      : "Once standard verification details are validated, the administrator will approve your search listing."}
                  </p>
                </div>
              )}
            </div>

            {/* Change Password Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm shadow-zinc-200/50">
              <h2 className="text-base font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <KeyRound className="h-4.5 w-4.5 text-orange-600 shrink-0" />
                <span>{language === "hi" ? "पासवर्ड बदलें" : "Reset Password"}</span>
              </h2>

              {passwordError && (
                <div className="bg-red-50 text-red-655 text-[11px] font-semibold p-3.5 rounded-xl mb-4">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold p-3.5 rounded-xl mb-4 flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
                    {language === "hi" ? "वर्तमान पासवर्ड" : "Current Password"}
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 pr-10 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-xs outline-none transition-all duration-200 focus:ring-2 focus:ring-amber-500/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer flex items-center"
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
                    {language === "hi" ? "नया पासवर्ड" : "New Password"}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 pr-10 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-xs outline-none transition-all duration-200 focus:ring-2 focus:ring-amber-500/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer flex items-center"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
                    {language === "hi" ? "नए पासवर्ड की पुष्टि करें" : "Confirm Password"}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 pr-10 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white rounded-xl text-xs outline-none transition-all duration-200 focus:ring-2 focus:ring-amber-500/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer flex items-center"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2.5 font-bold text-xs hover:from-amber-600 hover:to-orange-700 shadow-md shadow-orange-500/10 hover:shadow-orange-500/25 transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>{updatingPassword ? (language === "hi" ? "अपडेट हो रहा है..." : "Updating...") : (language === "hi" ? "पासवर्ड अपडेट करें" : "Update Password")}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
