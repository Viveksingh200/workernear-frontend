"use client";

import { API_BASE_URL, getProfileImageUrl } from "@/config";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/languageContext";
import { useAuth } from "@/context/authContext";
import { Search, MapPin, Star, Filter, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SeoLandingClient({
  initialWorkers,
  initialTotal,
  initialTotalPages,
  serviceName,
  queryName,
  city,
  area,
  serviceSlug,
  locationSlug,
  seoSlug
}) {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();

  const handleProfileClick = (e, slug) => {
    if (!isAuthenticated) {
      e.preventDefault();
      window.location.href = "/register";
    }
  };

  // State initialized with server-side rendered values
  const [workers, setWorkers] = useState(initialWorkers);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Filter states
  const [rating, setRating] = useState("");
  
  // Search form states (initialized to current SEO page values)
  const [searchQuery, setSearchQuery] = useState(serviceName);
  const [formCity, setFormCity] = useState(city);
  const [formArea, setFormArea] = useState(area || "");

  // Fetch updated workers when rating filter or page changes
  const fetchUpdatedWorkers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      // Use queryName for the search query to correctly match the profession in backend (e.g. Plumber for Plumbing)
      queryParams.set("search", queryName);
      queryParams.set("city", city);
      if (area) queryParams.set("area", area);
      
      if (rating) queryParams.set("rating", rating);
      queryParams.set("page", page.toString());
      queryParams.set("limit", "9");

      const res = await fetch(`${API_BASE_URL}/workers?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setWorkers(data.workers);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Failed to load workers list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Avoid fetching on initial mount since we already have server results
    if (page !== 1 || rating !== "") {
      fetchUpdatedWorkers();
    }
  }, [rating, page]);

  // If user runs a brand new search in the search form, redirect them to the /workers page
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    
    // Combine city and area into location for the query params
    const locStr = formArea ? `${formArea}, ${formCity}` : formCity;
    if (locStr) params.set("location", locStr);
    
    window.location.href = `/workers?${params.toString()}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-emerald-50 text-emerald-700 border-emerald-250";
      case "Busy":
        return "bg-amber-50 text-amber-700 border-amber-250";
      case "Offline":
      default:
        return "bg-zinc-100 text-zinc-500 border-zinc-200";
    }
  };

  const locationString = area ? `${area}, ${city}` : city;

  return (
    <div className="flex flex-col w-full text-zinc-900">
      {/* Dynamic SEO Hero / Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 mb-2">
          {language === "hi" 
            ? `${locationString} में सर्वश्रेष्ठ ${serviceName} सेवाएं` 
            : `Best ${serviceName} Services in ${locationString}`}
        </h1>
        <p className="text-sm md:text-base text-zinc-500 max-w-2xl font-light">
          {language === "hi"
            ? `${locationString} में सत्यापित और अत्यधिक रेटेड ${serviceName} विशेषज्ञों को खोजें। उनकी उपलब्धता और रेटिंग देखें।`
            : `Find verified, highly rated ${serviceName} professionals in ${locationString}. Compare profiles, read real customer reviews, and hire instantly.`}
        </p>
      </div>

      {/* Search form to allow refinement/new searches */}
      <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm mb-8">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 px-3 py-2 border border-zinc-200 rounded-lg">
            <Search className="h-5 w-5 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === "hi" ? "व्यवसाय या नाम खोजें..." : "Search profession or name..."}
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 px-3 py-2 border border-zinc-200 rounded-lg bg-white">
            <MapPin className="h-5 w-5 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={formCity}
              onChange={(e) => setFormCity(e.target.value)}
              placeholder={language === "hi" ? "शहर (उदा. मुंबई)..." : "City (e.g. Mumbai)..."}
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 px-3 py-2 border border-zinc-200 rounded-lg bg-white">
            <MapPin className="h-5 w-5 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={formArea}
              onChange={(e) => setFormArea(e.target.value)}
              placeholder={language === "hi" ? "क्षेत्र/लोकेशन..." : "Area/Location..."}
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg py-2.5 text-sm font-semibold transition-all shadow-md cursor-pointer"
          >
            {t.searchButton}
          </button>
        </form>

        {/* Quick Filters */}
        <div className="mt-6 flex flex-wrap gap-4 items-center border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
            <Filter className="h-4 w-4" />
            <span>{language === "hi" ? "फिल्टर:" : "Filters:"}</span>
          </div>

          {/* Rating Filter */}
          <select
            value={rating}
            onChange={(e) => {
              setRating(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 border border-zinc-200 rounded-md text-xs bg-white text-zinc-700 focus:outline-none"
          >
            <option value="">{language === "hi" ? "न्यूनतम रेटिंग" : "Minimum Rating"}</option>
            <option value="4.5">4.5+ ★</option>
            <option value="4.0">4.0+ ★</option>
            <option value="3.0">3.0+ ★</option>
          </select>
        </div>
      </div>

      {/* Workers Grid Section */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center pb-2">
          <h2 className="text-xl font-bold text-zinc-900">
            {language === "hi"
              ? `परिणाम (${total} पेशेवर मिले)`
              : `Results (${total} professionals found)`}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-gray-150 rounded-xl h-80 w-full"></div>
            ))}
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-150 rounded-2xl p-8">
            <p className="text-zinc-500 font-semibold mb-2">
              {language === "hi" 
                ? `${locationString} में अभी तक कोई ${serviceName} प्रदाता उपलब्ध नहीं है।` 
                : `No ${serviceName} providers found in ${locationString} matching filters.`}
            </p>
            <p className="text-xs text-zinc-400">
              {language === "hi"
                ? "कृपया कोई अन्य फ़िल्टर बदल कर प्रयास करें।"
                : "Please try adjusting your minimum rating or location filter."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workers.map((worker) => (
                <div
                  key={worker._id}
                  className="group bg-white rounded-xl border border-gray-150 p-5 shadow-sm hover:shadow-md hover:border-gray-250 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Photo and Availability Badge */}
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="relative h-16 w-16 rounded-xl border border-gray-100 overflow-hidden shrink-0">
                        {worker.profileImage ? (
                          <img
                            src={getProfileImageUrl(worker.profileImage)}
                            alt={worker.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-amber-100 text-amber-700 font-bold text-lg">
                            {worker.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${getStatusColor(
                          worker.availability
                        )}`}
                      >
                        {language === "hi"
                          ? worker.availability === "Available"
                            ? "उपलब्ध"
                            : worker.availability === "Busy"
                            ? "व्यस्त"
                            : "ऑफ़लाइन"
                          : worker.availability}
                      </span>
                    </div>

                    {/* Description Details */}
                    <div>
                      <div className="flex items-center gap-1.5 text-orange-600 font-bold text-xs uppercase tracking-wide">
                        <span>{worker.profession}</span>
                        <CheckCircle2 className="h-3.5 w-3.5 fill-orange-100 text-orange-600 shrink-0" />
                      </div>
                      <h3 className="font-extrabold text-lg text-zinc-800 mt-0.5 group-hover:text-amber-600 transition-colors">
                        {worker.name}
                      </h3>

                      <div className="flex items-center gap-1 mt-1 text-xs text-zinc-500 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        <span>{worker.area}, {worker.city}</span>
                      </div>

                      <p className="mt-3 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                        {worker.description ||
                          (language === "hi" ? "कोई विवरण उपलब्ध नहीं है।" : "No description provided.")}
                      </p>
                    </div>
                  </div>

                  {/* Footer Card Info */}
                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                      <span className="text-xs font-bold text-zinc-700">{worker.rating || "0.0"}</span>
                      <span className="text-[10px] text-zinc-400">({worker.totalReviews})</span>
                    </div>

                    <a
                      href={`/worker/${worker.slug}`}
                      onClick={(e) => handleProfileClick(e, worker.slug)}
                      className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-500 hover:gap-1.5 transition-all"
                    >
                      <span>{language === "hi" ? "प्रोफ़ाइल देखें" : "View Profile"}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 border border-zinc-200 rounded-md text-xs font-semibold bg-white text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {language === "hi" ? "पिछला" : "Previous"}
                </button>
                <span className="text-xs text-zinc-500 font-medium px-2">
                  {language === "hi" ? `पेज ${page} का ${totalPages}` : `Page ${page} of ${totalPages}`}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border border-zinc-200 rounded-md text-xs font-semibold bg-white text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {language === "hi" ? "अगला" : "Next"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
