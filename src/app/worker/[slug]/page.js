import { API_BASE_URL, getProfileImageUrl } from "@/config";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorkerProfileClient from "./WorkerProfileClient";

// Fetch worker details on the server for SSR and SEO meta tags
async function fetchWorkerData(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/workers/slug/${slug}`, {
      next: { revalidate: 60 } // Cache and revalidate every 60 seconds
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.worker : null;
  } catch (err) {
    console.error("Error fetching worker data in SSR:", err);
    return null;
  }
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const worker = await fetchWorkerData(resolvedParams.slug);

  if (!worker) {
    return {
      title: "Worker Profile | Local Service Finder",
      description: "Find trusted local professionals near you."
    };
  }

  return {
    title: `${worker.name} - Professional ${worker.profession} in ${worker.city} | Workers`,
    description: `${worker.name} is a trusted ${worker.profession} offering services in ${worker.city}. ${worker.description?.slice(0, 120)}...`,
      openGraph: {
        title: `${worker.name} - ${worker.profession} | Workers`,
        description: worker.description || `Call ${worker.name} for local professional service in ${worker.city}.`,
        images: worker.profileImage ? [{ url: getProfileImageUrl(worker.profileImage) }] : []
      }
  };
}

export default async function WorkerProfilePage({ params }) {
  const resolvedParams = await params;
  const worker = await fetchWorkerData(resolvedParams.slug);

  if (!worker) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-20 px-6">
          <div className="text-center bg-white p-8 border border-gray-250 rounded-2xl max-w-sm">
            <h2 className="text-lg font-bold text-zinc-900 mb-2">Worker Profile Not Found</h2>
            <p className="text-xs text-zinc-500 mb-4">
              The worker you are looking for might have updated their details or is pending admin approval.
            </p>
            <a
              href="/workers"
              className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 rounded-lg text-white font-semibold text-xs"
            >
              Browse Other Workers
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Schema.org structured data (JSON-LD) for Search Crawlers
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": worker.name,
    "image": getProfileImageUrl(worker.profileImage) || "http://localhost:3000/register.png",
    "description": worker.description || `Professional ${worker.profession} in ${worker.city}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": worker.area,
      "addressRegion": worker.city,
      "addressCountry": worker.country === "India" ? "IN" : worker.country === "United States" ? "US" : (worker.country || "US")
    },
    "aggregateRating": worker.totalReviews > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": worker.rating.toString(),
      "reviewCount": worker.totalReviews.toString()
    } : undefined
  };

  return (
    <>
      {/* Insert JSON-LD into head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full animate-fadeIn">
          <WorkerProfileClient initialWorker={worker} />
        </main>
        <Footer />
      </div>
    </>
  );
}
