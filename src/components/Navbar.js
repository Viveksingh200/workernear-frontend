"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLanguage } from "../context/languageContext";
import { useAuth } from "../context/authContext";
import { Globe, User, Calendar, LogOut, Briefcase, MapPin, ChevronDown, Navigation } from "lucide-react";
import { getProfileImageUrl } from "@/config";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { language, setSpecificLanguage, t } = useLanguage();
  const { user, workerProfile, logout, currentLocation, updateLocation, detectLocation } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [editCity, setEditCity] = useState("");
  const [editArea, setEditArea] = useState("");
  
  const pathname = usePathname();
  const isWorkerOrAdminPanel = pathname?.startsWith("/worker") || pathname?.startsWith("/admin");

  useEffect(() => {
    if (currentLocation) {
      setEditCity(currentLocation.city || "");
      setEditArea(currentLocation.area || "");
    }
  }, [currentLocation]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/85 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 lg:px-0">
        
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="flex h-7 md:h-9 w-7 md:w-9 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 shadow-md shadow-orange-500/20">
            <Briefcase className="h-3 md:h-5 w-3 md:w-5 text-white" />
          </div>
          <span className="text-sm md:text-xl font-bold tracking-tight text-zinc-900 hidden md:block">
            {t.brand}
          </span>
        </a>

        {/* Right Side Tools */}
        <div className="flex items-center gap-2 sm:gap-6">
          {/* Location Picker */}
          {!isWorkerOrAdminPanel && (
            <div className="relative">
              <button
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-full border border-gray-200/80 hover:border-zinc-300 bg-gray-100 hover:bg-zinc-50 transition-all text-[10px] sm:text-xs font-semibold text-zinc-700 cursor-pointer focus:outline-none"
              >
                <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span className="truncate max-w-[100px] sm:max-w-[150px]">
                  {currentLocation?.area ? `${currentLocation.area}, ` : ""}{currentLocation?.city || "Mumbai"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              </button>

              {locationDropdownOpen && (
                <>
                  {/* Backdrop Close trigger */}
                  <div
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={() => setLocationDropdownOpen(false)}
                  ></div>

                  {/* Dropdown Card */}
                  <div className="absolute -left-10 md:left-0 md:right-0 mt-2 w-64 origin-top-right rounded-2xl border border-gray-150 bg-white p-4 shadow-xl z-20 animate-fadeIn">
                    <h3 className="text-xs font-black text-zinc-800 uppercase tracking-wider mb-3">
                      {t.changeLocation}
                    </h3>

                    {/* Use Current Location Button */}
                    <button
                      onClick={async () => {
                        await detectLocation(true);
                        setLocationDropdownOpen(false);
                      }}
                      className="w-full mb-3 flex items-center justify-center gap-2 rounded-xl bg-amber-50 border border-amber-100 hover:bg-amber-100/50 text-amber-700 py-2 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      <span>{t.useCurrentLocation}</span>
                    </button>

                    <div className="space-y-3">
                      {/* Popular City Quick Chips */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase text-left">
                          {language === "hi" ? "लोकप्रिय शहर:" : "Popular Cities:"}
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {["Mumbai", "Thane", "Navi Mumbai", "Pune", "Delhi"].map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                setEditCity(c);
                                setEditArea("");
                              }}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                                editCity === c
                                  ? "bg-amber-500 text-white shadow-xs"
                                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* City Input with Datalist */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase text-left">{t.city}</label>
                        <input
                          type="text"
                          list="popular-cities-list"
                          value={editCity}
                          onChange={(e) => setEditCity(e.target.value)}
                          placeholder={language === "hi" ? "शहर का नाम दर्ज करें (उदा. Thane)" : "Enter city (e.g. Thane, Mumbai)"}
                          className="w-full px-3 py-2 border border-zinc-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-lg text-xs bg-white text-zinc-900 outline-none transition-all"
                        />
                        <datalist id="popular-cities-list">
                          <option value="Mumbai" />
                          <option value="Thane" />
                          <option value="Navi Mumbai" />
                          <option value="Palghar" />
                          <option value="Bhiwandi" />
                          <option value="Kalyan" />
                          <option value="Dombivli" />
                          <option value="Pune" />
                          <option value="Delhi" />
                          <option value="Bangalore" />
                          <option value="Hyderabad" />
                          <option value="Ahmedabad" />
                        </datalist>
                      </div>

                      {/* Area/Locality Input with Datalist */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase text-left">{t.area}</label>
                        <input
                          type="text"
                          list="popular-areas-list"
                          value={editArea}
                          onChange={(e) => setEditArea(e.target.value)}
                          placeholder={language === "hi" ? "क्षेत्र/लोकेशन दर्ज करें (उदा. Kolshet)" : "Enter area/locality (e.g. Kolshet, Airoli)"}
                          className="w-full px-3 py-2 border border-zinc-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-lg text-xs bg-white text-zinc-900 outline-none transition-all"
                        />
                        <datalist id="popular-areas-list">
                          <option value="Belapur" />
                          <option value="Seawoods" />
                          <option value="Nerul" />
                          <option value="Kharghar" />
                          <option value="Vashi" />
                          <option value="Airoli" />
                          <option value="Kolshet" />
                          <option value="Wagle Estate" />
                          <option value="Mulund" />
                          <option value="Dahisar" />
                          <option value="Andheri" />
                          <option value="Bandra" />
                          <option value="Dadar" />
                        </datalist>
                      </div>

                      {/* Apply Button */}
                      <button
                        onClick={() => {
                          updateLocation({ city: editCity.trim(), area: editArea.trim() });
                          setLocationDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-2 text-xs font-bold transition-all shadow-md shadow-orange-500/20 cursor-pointer mt-2"
                      >
                        <span>{language === "hi" ? "लागू करें" : "Apply Location"}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Language Toggle Switcher */}
          <div className="flex items-center gap-1 rounded-full border border-gray-200/80 p-0.5 bg-gray-100">
            <button
              onClick={() => setSpecificLanguage("en")}
              className={`px-2.5 py-1 text-[10px] sm:text-xs font-semibold rounded-full transition-all duration-300 cursor-pointer ${
                language === "en"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setSpecificLanguage("hi")}
              className={`px-2.5 py-1 text-[10px] sm:text-xs font-semibold rounded-full transition-all duration-300 cursor-pointer ${
                language === "hi"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Log-In and Sign-Up Actions (Hidden if logged in, otherwise visible) */}
          {!user ? (
            <>
              <a
                href="/login"
                className="hidden md:block text-xs sm:text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors"
              >
                {t.login}
              </a>
              <a
                href="/register"
                className="hidden md:flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:from-amber-600 hover:to-orange-700 transition-all duration-200 hover:scale-[1.02]"
              >
                {t.register}
              </a>
            </>
          ) : null}

          {/* Profile Dropdown Button (Only Visible when Logged In) */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:scale-105 transition-all duration-150 overflow-hidden cursor-pointer focus:outline-none"
              >
                <div className="relative h-full w-full">
                  {workerProfile?.profileImage ? (
                    <img
                      src={getProfileImageUrl(workerProfile.profileImage)}
                      alt="User Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-amber-100 text-amber-700 font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </button>

              {profileDropdownOpen && (
                <>
                  {/* Backdrop Close trigger */}
                  <div
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={() => setProfileDropdownOpen(false)}
                  ></div>

                  {/* Dropdown Card */}
                  <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-gray-150 bg-white p-2 shadow-lg z-20 focus:outline-none">
                    
                    <div className="px-3 py-2 border-b border-gray-100 mb-2">
                      <p className="text-xs font-semibold text-zinc-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{user.role === "provider" ? "Worker" : user.role}</p>
                    </div>

                    <a
                      href={user.role === "admin" ? "/admin" : user.role === "provider" ? "/worker/dashboard" : "/profile"}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 text-zinc-400" />
                      <span>{user.role === "admin" ? "Admin Panel" : user.role === "provider" ? "Worker Dashboard" : t.myProfile}</span>
                    </a>

                    <hr className="my-1.5 border-gray-100" />

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 text-red-400" />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Mobile login/register link triggers for guests
            <div className="md:hidden">
              <a
                href="/login"
                className="flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all"
              >
                {t.login}
              </a>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
