"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/languageContext";
import { useAuth } from "../context/authContext";
import { Search, MapPin } from "lucide-react";

export default function Hero() {
  const { t } = useLanguage();
  const { currentLocation } = useAuth();
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (currentLocation) {
      const locStr = currentLocation.area 
        ? `${currentLocation.area}, ${currentLocation.city}` 
        : currentLocation.city;
      setLocation(locStr || "");
    }
  }, [currentLocation]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (location) params.set("location", location);
    window.location.href = `/workers?${params.toString()}`;
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-tr from-[#0c3530] via-[#18473a] to-[#785b1a] px-6 py-12 md:py-24 lg:py-32 lg:px-8">
      {/* Decorative Blur Orbs for Extra Premium Feel */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl"></div>

      <div className="mx-auto max-w-4xl text-center">
        {/* Main Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-sm leading-tight">
          {t.heroTitle}
        </h1>
        {/* Subtitle */}
        <p className="mt-4 md:mt-6 text-sm sm:text-base md:text-lg leading-relaxed text-zinc-100/90 font-light max-w-2xl mx-auto">
          {t.heroSubtitle}
        </p>

        {/* Search Bar Container */}
        <form
          onSubmit={handleSearch}
          className="hero-search-form mx-auto mt-6 md:mt-10 max-w-3xl rounded-[30px] md:rounded-full bg-white p-2 shadow-xl shadow-black/10 border border-white/10"
        >
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0">
            {/* Location Input */}
            <div className="flex flex-1 items-center gap-3 px-4 py-2 border-b border-zinc-100 md:border-b-0">
              <MapPin className="h-5 w-5 text-zinc-400 shrink-0" />
              <input
                id="hero-location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t.locationPlaceholder}
                className="w-full bg-transparent text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none"
              />
            </div>

            {/* Vertical Divider (Desktop only) */}
            <div className="hidden md:block h-8 w-px bg-zinc-200"></div>

            {/* Search Input */}
            <div className="flex flex-[1.5] items-center gap-3 px-4 py-2">
              <Search className="h-5 w-5 text-zinc-400 shrink-0" />
              <input
                id="hero-query-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-transparent text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none"
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-7 py-3 text-sm font-semibold text-white shadow-md hover:from-amber-600 hover:to-orange-700 hover:scale-[1.01] active:scale-95 transition-all duration-200"
            >
              <Search className="h-4 w-4" />
              <span>{t.searchButton}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
