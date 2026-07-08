import { API_BASE_URL } from "@/config";
import { notFound } from "next/navigation";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoLandingClient from "./SeoLandingClient";

// Parse service and location from the slug (e.g., ac-repair-in-goregaon-west-mumbai)
function parseSeoSlug(slug) {
  if (!slug) return null;
  const match = slug.match(/^(.+)-in-(.+)$/);
  if (!match) return null;
  return {
    serviceSlug: match[1],
    locationSlug: match[2]
  };
}

// Convert service slug to display title and backend search term (e.g., ac-repair -> AC Repair / AC Repair, plumbing -> Plumbing / Plumber)
function parseServiceSlug(serviceSlug) {
  const serviceMappings = {
    "ac-repair": { displayName: "AC Repair", queryName: "AC Repair" },
    "appliance-repair": { displayName: "Appliance Repair", queryName: "Appliance Repair" },
    "house-cleaning": { displayName: "House Cleaning", queryName: "House Cleaning" },
    "plumbing": { displayName: "Plumbing", queryName: "Plumber" },
    "electrical": { displayName: "Electrical", queryName: "Electrician" }
  };
  
  const key = serviceSlug.toLowerCase();
  if (serviceMappings[key]) {
    return serviceMappings[key];
  }
  
  const fallbackName = serviceSlug
    .split("-")
    .map(word => {
      if (word.toLowerCase() === "ac") return "AC";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
    
  return { displayName: fallbackName, queryName: fallbackName };
}

// Convert location slug to city and area (e.g., goregaon-west-mumbai -> city Mumbai, area Goregaon West)
function parseLocationSlug(locationSlug) {
  const slug = locationSlug.toLowerCase().trim();
  const knownCities = [
    { slug: "navi-mumbai", name: "Navi Mumbai" },
    { slug: "mumbai", name: "Mumbai" },
    { slug: "delhi", name: "Delhi" },
    { slug: "pune", name: "Pune" },
    { slug: "bangalore", name: "Bangalore" },
    { slug: "bengaluru", name: "Bangalore" }
  ];

  for (const cityInfo of knownCities) {
    if (slug === cityInfo.slug) {
      return { city: cityInfo.name, area: "" };
    }
    if (slug.endsWith("-" + cityInfo.slug)) {
      const areaPart = slug.substring(0, slug.length - cityInfo.slug.length - 1);
      const areaName = areaPart
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return { city: cityInfo.name, area: areaName };
    }
  }

  // Fallback for general structure
  const parts = slug.split("-");
  if (parts.length > 1) {
    const cityPart = parts[parts.length - 1];
    const areaPart = parts.slice(0, -1).join("-");
    const cityName = cityPart.charAt(0).toUpperCase() + cityPart.slice(1);
    const areaName = areaPart
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return { city: cityName, area: areaName };
  } else {
    const cityName = slug.charAt(0).toUpperCase() + slug.slice(1);
    return { city: cityName, area: "" };
  }
}

// Fetch matching workers on the server for SSR and SEO
async function fetchWorkersData({ service, city, area }) {
  try {
    const queryParams = new URLSearchParams();
    if (service) queryParams.set("search", service);
    if (city) queryParams.set("city", city);
    if (area) queryParams.set("area", area);
    queryParams.set("page", "1");
    queryParams.set("limit", "9");

    const res = await fetch(`${API_BASE_URL}/workers?${queryParams.toString()}`, {
      next: { revalidate: 60 } // Cache response for 60 seconds
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data : null;
  } catch (err) {
    console.error("Error fetching workers data in SSR:", err);
    return null;
  }
}

// Generate Dynamic SEO Metadata
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const parsed = parseSeoSlug(resolvedParams.seoSlug);
  if (!parsed) return {};

  const { displayName } = parseServiceSlug(parsed.serviceSlug);
  const { city, area } = parseLocationSlug(parsed.locationSlug);
  const locationString = area ? `${area}, ${city}` : city;

  return {
    title: `Best ${displayName} Services in ${locationString} | WorkerNear`,
    description: `Find top-rated, certified ${displayName} professionals in ${locationString}. Read customer reviews, check real-time availability, and hire instantly online.`,
    alternates: {
      canonical: `https://workernear.com/${resolvedParams.seoSlug}`
    },
    openGraph: {
      title: `Best ${displayName} Services in ${locationString} | WorkerNear`,
      description: `Need ${displayName} in ${locationString}? Find trusted local professionals, check reviews, and hire instantly.`,
      url: `https://workernear.com/${resolvedParams.seoSlug}`,
      type: "website"
    }
  };
}

export default async function SeoLandingPage({ params }) {
  const resolvedParams = await params;
  const parsed = parseSeoSlug(resolvedParams.seoSlug);

  // If URL pattern is not service-in-location, trigger a 404
  if (!parsed) {
    notFound();
  }

  const { displayName, queryName } = parseServiceSlug(parsed.serviceSlug);
  const { city, area } = parseLocationSlug(parsed.locationSlug);
  const locationString = area ? `${area}, ${city}` : city;

  const data = await fetchWorkersData({ service: queryName, city, area });
  const workers = data?.workers || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Schema.org structured data (JSON-LD ItemList + LocalBusiness) for Google search ranking
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${displayName} in ${locationString}`,
    "description": `List of top-rated ${displayName} service providers in ${locationString}`,
    "itemListElement": workers.map((worker, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "LocalBusiness",
        "name": worker.name,
        "description": worker.description || `Professional ${worker.profession} in ${worker.city}`,
        "image": worker.profileImage ? `http://localhost:3000${worker.profileImage}` : undefined,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": worker.area,
          "addressRegion": worker.city,
          "addressCountry": "IN"
        },
        "aggregateRating": worker.totalReviews > 0 ? {
          "@type": "AggregateRating",
          "ratingValue": worker.rating.toString(),
          "reviewCount": worker.totalReviews.toString()
        } : undefined
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full">
          <SeoLandingClient
            initialWorkers={workers}
            initialTotal={total}
            initialTotalPages={totalPages}
            serviceName={displayName}
            queryName={queryName}
            city={city}
            area={area}
            serviceSlug={parsed.serviceSlug}
            locationSlug={parsed.locationSlug}
            seoSlug={resolvedParams.seoSlug}
          />
        </main>
        <Footer />
      </div>
    </>
  );
}
