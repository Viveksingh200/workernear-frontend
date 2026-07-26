"use client";

import React from "react";

/**
 * Shimmer base component for custom animated skeleton elements
 */
export const Shimmer = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-[length:200%_100%] rounded-md ${className}`}
  />
);

/**
 * Warmup Banner indicator displayed during backend cold-start
 */
export const BackendStatusNotice = () => (
  <div className="w-full flex items-center justify-center gap-2 py-2 px-4 mb-4 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 rounded-xl animate-pulse">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
    </span>
    <span>Connecting to server... Please wait a moment while data loads.</span>
  </div>
);

/**
 * Worker Card Skeleton (matches worker card layout)
 */
export const WorkerCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm flex flex-col justify-between h-[360px] animate-pulse">
    <div>
      {/* Photo & Availability badge */}
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="h-16 w-16 rounded-xl bg-zinc-200 shrink-0" />
        <div className="h-5 w-20 rounded-full bg-zinc-200" />
      </div>

      {/* Name & Category */}
      <div className="space-y-2 mb-4">
        <div className="h-5 w-3/4 bg-zinc-200 rounded" />
        <div className="h-4 w-1/2 bg-zinc-200 rounded" />
      </div>

      {/* Rating & Location */}
      <div className="space-y-2 mb-4">
        <div className="h-4 w-2/3 bg-zinc-200 rounded" />
        <div className="h-4 w-1/2 bg-zinc-200 rounded" />
      </div>
    </div>

    {/* Price & Action Button */}
    <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
      <div className="h-6 w-24 bg-zinc-200 rounded" />
      <div className="h-9 w-28 bg-amber-200/60 rounded-lg" />
    </div>
  </div>
);

/**
 * Category Card Skeleton
 */
export const CategoryCardSkeleton = () => (
  <div className="h-14 rounded-xl bg-white border border-zinc-200/80 p-3 flex items-center gap-3 animate-pulse shadow-xs">
    <div className="h-8 w-8 rounded-lg bg-zinc-200 shrink-0" />
    <div className="h-4 w-24 bg-zinc-200 rounded" />
  </div>
);

/**
 * Worker Profile Skeleton (Full page header + details)
 */
export const WorkerProfileSkeleton = () => (
  <div className="min-h-screen bg-zinc-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-pulse">
    {/* Cover Header */}
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="h-28 w-28 rounded-2xl bg-zinc-200 shrink-0" />
        <div className="flex-1 w-full space-y-3">
          <div className="h-7 w-48 bg-zinc-200 rounded mx-auto md:mx-0" />
          <div className="h-4 w-32 bg-zinc-200 rounded mx-auto md:mx-0" />
          <div className="h-4 w-64 bg-zinc-200 rounded mx-auto md:mx-0" />
          <div className="flex gap-2 pt-2 justify-center md:justify-start">
            <div className="h-8 w-24 bg-zinc-200 rounded-lg" />
            <div className="h-8 w-24 bg-zinc-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>

    {/* Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4">
          <div className="h-6 w-36 bg-zinc-200 rounded" />
          <div className="h-4 w-full bg-zinc-200 rounded" />
          <div className="h-4 w-5/6 bg-zinc-200 rounded" />
          <div className="h-4 w-4/6 bg-zinc-200 rounded" />
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4">
          <div className="h-6 w-36 bg-zinc-200 rounded" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border border-zinc-100 rounded-xl space-y-2">
              <div className="h-4 w-32 bg-zinc-200 rounded" />
              <div className="h-3 w-full bg-zinc-200 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4">
          <div className="h-6 w-28 bg-zinc-200 rounded" />
          <div className="h-10 w-full bg-amber-200/60 rounded-xl" />
          <div className="h-10 w-full bg-zinc-200 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

/**
 * Worker Dashboard Skeleton
 */
export const DashboardSkeleton = () => (
  <div className="min-h-screen bg-zinc-50 p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-pulse">
    {/* Header */}
    <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-zinc-200/80">
      <div className="space-y-2">
        <div className="h-7 w-48 bg-zinc-200 rounded" />
        <div className="h-4 w-32 bg-zinc-200 rounded" />
      </div>
      <div className="h-10 w-32 bg-amber-200/60 rounded-xl" />
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-200/80 space-y-3">
          <div className="h-4 w-24 bg-zinc-200 rounded" />
          <div className="h-8 w-16 bg-zinc-200 rounded" />
        </div>
      ))}
    </div>

    {/* Main Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-200/80 space-y-4">
        <div className="h-6 w-36 bg-zinc-200 rounded" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-zinc-100 rounded-xl" />
        ))}
      </div>
      <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 space-y-4">
        <div className="h-6 w-28 bg-zinc-200 rounded" />
        <div className="h-32 bg-zinc-100 rounded-xl" />
      </div>
    </div>
  </div>
);

/**
 * Review Cards Skeleton
 */
export const ReviewCardSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="p-4 bg-white border border-zinc-200/80 rounded-xl space-y-2 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-4 w-28 bg-zinc-200 rounded" />
          <div className="h-4 w-16 bg-zinc-200 rounded" />
        </div>
        <div className="h-3 w-full bg-zinc-200 rounded" />
        <div className="h-3 w-4/5 bg-zinc-200 rounded" />
      </div>
    ))}
  </div>
);

/**
 * User Profile Settings Skeleton
 */
export const ProfileSkeleton = () => (
  <div className="min-h-screen bg-zinc-50 py-10 px-4 max-w-4xl mx-auto space-y-8 animate-pulse">
    <div className="bg-white p-8 rounded-2xl border border-zinc-200/80 space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 bg-zinc-200 rounded-full" />
        <div className="space-y-2">
          <div className="h-6 w-40 bg-zinc-200 rounded" />
          <div className="h-4 w-28 bg-zinc-200 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
        <div className="h-12 bg-zinc-100 rounded-xl" />
        <div className="h-12 bg-zinc-100 rounded-xl" />
        <div className="h-12 bg-zinc-100 rounded-xl" />
        <div className="h-12 bg-zinc-100 rounded-xl" />
      </div>
    </div>
  </div>
);
