"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/languageContext";
import { API_BASE_URL } from "@/config";

const BACKEND_URL = API_BASE_URL;

export default function PopularServices() {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Predefined localized services fallback if server returns empty or fails
  const fallbackServices = [
    {
      name: t.acRepair,
      slug: "ac-repair",
    },
    {
      name: t.plumbing,
      slug: "plumbing",
    },
    {
      name: t.electrical,
      slug: "electrical",
    },
    {
      name: t.applianceRepair,
      slug: "appliance-repair",
    },
    {
      name: t.houseCleaning,
      slug: "house-cleaning",
    },
    {
      name: t.gardening,
      slug: "gardening",
    },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/categories`);
        const data = await res.json();
        if (data.success && data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        } else {
          setCategories(fallbackServices);
        }
      } catch (err) {
        console.error("Failed to load homepage categories, using fallback:", err);
        setCategories(fallbackServices);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [t]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 md:py-10 py-4 lg:px-8 bg-transparent">
        <div className="pb-1">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-zinc-900">
            {t.popularTitle}
          </h2>
        </div>
        <div className="mt-8 flex flex-row overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 pb-4 md:pb-0 scrollbar-none">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-12 rounded-xl bg-white border border-gray-150 animate-pulse w-36 md:w-auto shrink-0 md:shrink"
            ></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 md:py-10 py-4 lg:px-8 bg-transparent transition-colors duration-300">
      {/* Title Header */}
      <div className="pb-1">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-zinc-900">
          {t.popularTitle}
        </h2>
      </div>

      {/* Responsive layout: scrollable row on mobile, full grid on desktop */}
      <div className="mt-8 flex flex-row overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 pb-4 md:pb-0 scrollbar-none scroll-smooth">
        {categories.map((cat, index) => {
          const slug = cat.slug || "";

          // Determine Tailwind dynamic text hover and border color safely
          const hoverTextColors = {
            "ac-repair": "hover:text-blue-600 hover:border-blue-300",
            "plumbing": "hover:text-amber-600 hover:border-amber-300",
            "electrical": "hover:text-emerald-600 hover:border-emerald-300",
            "appliance-repair": "hover:text-indigo-600 hover:border-indigo-300",
            "house-cleaning": "hover:text-purple-600 hover:border-purple-300",
            "gardening": "hover:text-green-600 hover:border-green-300",
          };
          const hoverClass = hoverTextColors[slug] || "hover:text-orange-600 hover:border-orange-300";

          return (
            <a
              href={`/workers?category=${encodeURIComponent(cat.name)}`}
              key={index}
              className={`group flex items-center justify-center rounded-xl bg-white border border-gray-150 py-3.5 px-5 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer w-36 md:w-auto shrink-0 md:shrink ${hoverClass}`}
            >
              {/* Service name */}
              <h3 className="text-sm font-bold text-zinc-700 transition-colors truncate w-full px-1 group-hover:text-inherit">
                {cat.name}
              </h3>
            </a>
          );
        })}
      </div>
    </section>
  );
}
