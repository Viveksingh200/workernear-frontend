"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "../context/languageContext";
import { useAuth } from "../context/authContext";
import { Star } from "lucide-react";
import { API_BASE_URL, getProfileImageUrl } from "@/config";
import { getLocalizedBio } from "@/utils/translateBio";

export default function TopProfessionals() {
  const { t, language } = useLanguage();
  const { isAuthenticated, currentLocation } = useAuth();
  const [professionals, setProfessionals] = useState([]);
  const [isLocal, setIsLocal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const handleProfileClick = (e, slug) => {
    if (!isAuthenticated) {
      e.preventDefault();
      const targetUrl = slug && slug !== "#" ? `/worker/${slug}` : "";
      window.location.href = targetUrl ? `/register?redirect=${encodeURIComponent(targetUrl)}` : "/register";
    }
  };

  useEffect(() => {
    const fetchTopPros = async () => {
      try {
        let url = `${API_BASE_URL}/workers?limit=10&page=${page}`;
        if (currentLocation && currentLocation.city) {
          url += `&city=${encodeURIComponent(currentLocation.city)}`;
          if (currentLocation.area) {
            url += `&area=${encodeURIComponent(currentLocation.area)}`;
          }
        }

        const res = await fetch(url);
        const data = await res.json();
        if (data.success && data.workers && data.workers.length > 0) {
          const mapped = data.workers.map((w) => ({
            name: w.name,
            role: w.profession,
            image: getProfileImageUrl(w.profileImage) || "",
            rating: Math.round(w.rating) || 5,
            reviewsCount: w.totalReviews || 0,
            slug: w.slug,
            bio: w.description || "",
            bio_hi: w.description_hi || ""
          }));
          setProfessionals(mapped);
          setTotal(data.total || mapped.length);
          setTotalPages(data.totalPages || 1);
          setIsLocal(true);
        } else {
          // If query with area failed or returned empty, try city-only search first, or fallback to all top pros
          let cityOnlySuccess = false;
          if (currentLocation && currentLocation.city && currentLocation.area) {
            const cityRes = await fetch(`${API_BASE_URL}/workers?city=${encodeURIComponent(currentLocation.city)}&limit=10&page=${page}`);
            const cityData = await cityRes.json();
            if (cityData.success && cityData.workers && cityData.workers.length > 0) {
              const mapped = cityData.workers.map((w) => ({
                name: w.name,
                role: w.profession,
                image: getProfileImageUrl(w.profileImage) || "",
                rating: Math.round(w.rating) || 5,
                reviewsCount: w.totalReviews || 0,
                slug: w.slug,
                bio: w.description || "",
                bio_hi: w.description_hi || ""
              }));
              setProfessionals(mapped);
              setTotal(cityData.total || mapped.length);
              setTotalPages(cityData.totalPages || 1);
              setIsLocal(true);
              cityOnlySuccess = true;
            }
          }

          if (!cityOnlySuccess) {
            console.log("No local workers found, falling back to all top professionals");
            const fallbackRes = await fetch(`${API_BASE_URL}/workers?limit=10&page=${page}`);
            const fallbackData = await fallbackRes.json();
            if (fallbackData.success && fallbackData.workers && fallbackData.workers.length > 0) {
              const mapped = fallbackData.workers.map((w) => ({
                name: w.name,
                role: w.profession,
                image: getProfileImageUrl(w.profileImage) || "",
                rating: Math.round(w.rating) || 5,
                reviewsCount: w.totalReviews || 0,
                slug: w.slug,
                bio: w.description || "",
                bio_hi: w.description_hi || ""
              }));
              setProfessionals(mapped);
              setTotal(fallbackData.total || mapped.length);
              setTotalPages(fallbackData.totalPages || 1);
              setIsLocal(false);
            } else {
              setProfessionals([]);
              setTotal(0);
              setTotalPages(1);
              setIsLocal(false);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load top professionals:", err);
        setProfessionals([]);
        setTotal(0);
        setTotalPages(1);
        setIsLocal(false);
      }
    };

    fetchTopPros();
  }, [t, currentLocation, page]);

  return (
    <section id="top-professionals-section" className="mx-auto max-w-7xl px-4 sm:px-6 md:py-10 py-4 lg:px-8 bg-zinc-50/50 transition-colors duration-300">
      {/* Title */}
      <div className="pb-4 border-b border-gray-150 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="text-left">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-zinc-900">
            {isLocal ? t.workersNearYou : t.topProfessionals}
          </h2>
          {currentLocation?.city && (
            <p className="text-xs text-zinc-400 font-semibold mt-1 uppercase tracking-wider">
              {t.showingWorkersIn} {currentLocation.area ? `${currentLocation.area}, ` : ""}{currentLocation.city}
            </p>
          )}
        </div>
      </div>

      {!isLocal && currentLocation?.city && professionals.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 text-xs font-semibold text-left">
          {language === "hi" 
            ? `आपके स्थान (${currentLocation.area ? `${currentLocation.area}, ` : ""}${currentLocation.city}) में कोई वर्कर नहीं मिला। नीचे अन्य लोकप्रिय वर्कर दिए गए हैं:`
            : `No workers found near ${currentLocation.area ? `${currentLocation.area}, ` : ""}${currentLocation.city}. Showing other top workers instead:`}
        </div>
      )}

      {professionals.length === 0 ? (
        <div className="mt-6 p-8 sm:p-12 rounded-2xl bg-white border border-zinc-200/80 text-center shadow-xs">
          <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-3 text-zinc-400">
            <Star className="h-6 w-6 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-bold text-zinc-800 mb-1">
            {language === "hi" ? "कोई वर्कर नहीं मिला" : "No Approved Workers Found"}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
            {language === "hi"
              ? "आपके चयनित स्थान में अभी कोई स्वीकृत वर्कर उपलब्ध नहीं है।"
              : "There are currently no approved workers registered in this area."}
          </p>
        </div>
      ) : (
        /* List Layout Stack */
        <div className="mt-6 flex flex-col gap-4">
        {professionals.map((pro, index) => (
          <div
            key={index}
            className="group flex items-center gap-3.5 sm:gap-5 p-3.5 sm:p-5 rounded-2xl bg-white border border-gray-150 shadow-sm hover:shadow-md hover:border-gray-250 transition-all duration-300 w-full"
          >
            {/* Professional Image Thumbnail */}
            <a
              href={pro.slug && pro.slug !== "#" ? `/worker/${pro.slug}` : "/register"}
              onClick={(e) => handleProfileClick(e, pro.slug)}
              className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden bg-zinc-100 cursor-pointer shrink-0 border border-gray-100"
            >
              {pro.image ? (
                <img
                  src={pro.image}
                  alt={pro.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-amber-100 text-amber-700 font-extrabold text-lg sm:text-xl">
                  {pro.name.charAt(0).toUpperCase()}
                </div>
              )}
            </a>

            {/* Info details (Center section) */}
            <div className="flex-grow min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 text-left">
                <span className="inline-block px-2.5 py-0.5 text-[8px] sm:text-[9px] font-bold rounded bg-orange-50 text-orange-600 border border-orange-100 uppercase tracking-wider mb-1">
                  {pro.role}
                </span>
                
                <a
                  href={pro.slug && pro.slug !== "#" ? `/worker/${pro.slug}` : "/register"}
                  onClick={(e) => handleProfileClick(e, pro.slug)}
                  className="block cursor-pointer"
                >
                  <h3 className="text-sm sm:text-base font-black text-zinc-900 group-hover:text-amber-600 transition-colors truncate">
                    {pro.name}
                  </h3>
                </a>

                {/* Bio/Description */}
                {pro.bio && (
                  <p className="mt-1 text-xs text-zinc-550 text-zinc-500 line-clamp-1 leading-relaxed max-w-xl">
                    {getLocalizedBio(pro.bio, language, pro.bio_hi)}
                  </p>
                )}

                {/* Stars & Reviews */}
                <div className="flex items-center gap-1.5 mt-1 text-[10px] sm:text-xs text-zinc-500 font-semibold">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 ${
                          i < pro.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-400">•</span>
                  <span className="text-[10px] sm:text-[11px] text-zinc-500">
                    {pro.reviewsCount} {t.reviews}
                  </span>
                </div>
              </div>

              {/* View Profile CTA */}
              <div className="shrink-0 flex items-center justify-start sm:justify-center mt-1 sm:mt-0">
                <a
                  href={pro.slug && pro.slug !== "#" ? `/worker/${pro.slug}` : "/register"}
                  onClick={(e) => handleProfileClick(e, pro.slug)}
                  className="flex items-center justify-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white text-zinc-700 text-[10px] sm:text-xs font-black tracking-wide transition-all shadow-sm group-hover:scale-[1.01]"
                >
                  <span>{language === "hi" ? "प्रोफ़ाइल देखें" : "View Profile"}</span>
                </a>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Interactive Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-200/80">
          <p className="text-xs text-zinc-500 font-semibold">
            {language === "hi"
              ? `कुल ${total} में से ${((page - 1) * 10) + 1}-${Math.min(page * 10, total)} वर्कर दिखा रहे हैं`
              : `Showing ${((page - 1) * 10) + 1}-${Math.min(page * 10, total)} of ${total} workers`}
          </p>

          <div className="flex items-center gap-1.5">
            <button
              disabled={page === 1}
              onClick={() => {
                setPage(page - 1);
                const el = document.getElementById("top-professionals-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-3.5 py-2 border border-zinc-200 rounded-xl text-xs font-extrabold bg-white text-zinc-700 hover:bg-zinc-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            >
              {language === "hi" ? "« पिछला" : "« Prev"}
            </button>

            {[...Array(totalPages)].map((_, idx) => {
              const pageNum = idx + 1;
              const isCurrent = pageNum === page;
              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    setPage(pageNum);
                    const el = document.getElementById("top-professionals-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`h-9 w-9 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/10 scale-105"
                      : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              disabled={page === totalPages}
              onClick={() => {
                setPage(page + 1);
                const el = document.getElementById("top-professionals-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-3.5 py-2 border border-zinc-200 rounded-xl text-xs font-extrabold bg-white text-zinc-700 hover:bg-zinc-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            >
              {language === "hi" ? "अगला »" : "Next »"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
