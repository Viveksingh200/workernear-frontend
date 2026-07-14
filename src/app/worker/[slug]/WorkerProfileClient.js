"use client";

import { API_BASE_URL, getProfileImageUrl } from "@/config";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { useLanguage } from "@/context/languageContext";
import { Star, MapPin, Phone, Award, ShieldCheck, Heart, Send, CheckCircle2, Trash2 } from "lucide-react";
import Link from "next/link";

export default function WorkerProfileClient({ initialWorker }) {
  const { user, isAuthenticated, loading } = useAuth();
  const { t, language } = useLanguage();
  const currentUserId = user?.id || user?._id;

  const [worker, setWorker] = useState(initialWorker);

  // Security fallback for direct URL access by guest users
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = "/register";
    }
  }, [isAuthenticated, loading]);
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Review form states
  const [ratingInput, setRatingInput] = useState(1);
  const [commentInput, setCommentInput] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const hasReviewed = isAuthenticated && user && reviews.some(r => {
    const reviewerId = (r.userId?._id || r.userId)?.toString();
    return reviewerId === currentUserId;
  });

  const myReview = reviews.find(r => {
    const reviewerId = (r.userId?._id || r.userId)?.toString();
    return reviewerId === currentUserId;
  });

  // Fetch full details (increments views & retrieves full phone if logged in)
  useEffect(() => {
    const fetchFullDetails = async () => {
      const token = localStorage.getItem("authToken");
      if (token && isAuthenticated) {
        try {
          const res = await fetch(`${API_BASE_URL}/workers/${initialWorker._id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (data.success) {
            setWorker(data.worker);
          }
        } catch (err) {
          console.error("Failed to increment views & fetch details:", err);
        }
      }
    };

    fetchFullDetails();
  }, [isAuthenticated, initialWorker._id]);

  // Fetch reviews list
  const fetchReviewsList = async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/worker/${initialWorker._id}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviewsList();
  }, [initialWorker._id]);

  // Handle dial call click
  const handleCallClick = () => {
    if (!isAuthenticated) {
      alert(language === "hi" ? "कृपया फ़ोन नंबर देखने और कॉल करने के लिए लॉगिन करें।" : "Please log in to view phone number and call.");
      return;
    }
    setPhoneVisible(true);
    window.location.href = `tel:${worker.phone}`;
  };

  // Handle review submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    setSubmittingReview(true);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setSubmitError("You must be logged in to submit a review.");
      setSubmittingReview(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/reviews/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          workerId: worker._id,
          rating: ratingInput,
          comment: commentInput
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      setSubmitSuccess(
        language === "hi"
          ? "आपकी प्रतिक्रिया के लिए धन्यवाद! रेटिंग जोड़ी गई।"
          : "Thank you for your feedback! Rating added."
      );
      setCommentInput("");
      setRatingInput(1);
      
      // Update worker stats dynamically in frontend
      setWorker((prev) => ({
        ...prev,
        rating: data.workerRating,
        totalReviews: data.workerReviewsCount,
        rankingScore: data.rankingScore
      }));

      // Refresh reviews list
      await fetchReviewsList();
    } catch (err) {
      setSubmitError(
        err.message ||
          (language === "hi" ? "समीक्षा सबमिट करने में त्रुटि।" : "Error submitting review.")
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle review deletion
  const handleDeleteReview = async () => {
    if (!myReview) return;
    setSubmitError("");
    setSubmitSuccess("");
    setRatingInput(1);
    setCommentInput("");

    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/${myReview._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete review");
      }

      setSubmitSuccess(
        language === "hi"
          ? "समीक्षा सफलतापूर्वक हटा दी गई!"
          : "Review deleted successfully!"
      );

      // Update local worker metrics
      setWorker((prev) => ({
        ...prev,
        rating: data.workerRating,
        totalReviews: data.workerReviewsCount
      }));

      // Refresh reviews list
      await fetchReviewsList();
    } catch (err) {
      const errorMsg =
        err.message ||
        (language === "hi" ? "समीक्षा हटाने में त्रुटि।" : "Error deleting review.");
      setSubmitError(errorMsg);
    } finally {
      setIsDeleteModalOpen(false);
    }
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

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Profile Card Info */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-sm">
          {/* Header row details */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-gray-100">
            <div className="flex gap-4 items-center">
              <div className="relative h-20 w-20 rounded-2xl border border-gray-150 overflow-hidden shrink-0 bg-zinc-50">
                {worker.profileImage ? (
                  <img src={getProfileImageUrl(worker.profileImage)} alt={worker.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-amber-100 text-amber-700 font-extrabold text-2xl">
                    {worker.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-orange-50 text-orange-600 border border-orange-100 uppercase tracking-wider">
                  {worker.profession}
                </span>
                <h1 className="text-2xl font-black text-zinc-900 mt-1">{worker.name}</h1>
                <div className="flex items-center gap-1 mt-1.5 text-sm text-zinc-500 font-semibold">
                  <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
                  <span>{worker.area}, {worker.city}</span>
                </div>
                <div className="mt-3">
                  <a
                    href={`tel:${worker.phone}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white py-2 px-4 font-bold text-xs hover:bg-emerald-700 shadow-sm transition-colors cursor-pointer"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{worker.phone}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Badges and availability */}
            <div className="flex flex-wrap gap-3 items-center">
              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(worker.availability)}`}>
                {language === "hi"
                  ? worker.availability === "Available"
                    ? "उपलब्ध"
                    : worker.availability === "Busy"
                    ? "व्यस्त"
                    : "ऑफ़लाइन"
                  : worker.availability}
              </span>
              {worker.approved && (
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>{language === "hi" ? "सत्यापित" : "Verified Pro"}</span>
                </span>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 py-6 border-b border-gray-100 text-center">
            <div>
              <p className="text-xl font-black text-zinc-900 flex items-center justify-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400 shrink-0" />
                <span>{worker.rating || "0.0"}</span>
              </p>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold uppercase mt-1">
                {language === "hi" ? "रेटिंग" : "Rating"}
              </p>
            </div>

            <div>
              <p className="text-xl font-black text-zinc-900">{worker.experience} {language === "hi" ? "साल" : "Years"}</p>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold uppercase mt-1">
                {language === "hi" ? "अनुभव" : "Experience"}
              </p>
            </div>

            <div>
              <p className="text-xl font-black text-zinc-900">{worker.profileViews || 0}</p>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold uppercase mt-1">
                {language === "hi" ? "प्रोफ़ाइल दृश्य" : "Profile Views"}
              </p>
            </div>
          </div>

          {/* About description */}
          <div className="pt-6">
            <h2 className="text-lg font-bold text-zinc-900 mb-3">
              {language === "hi" ? "मेरे बारे में" : "About Me"}
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
              {worker.description || (language === "hi" ? "इस पेशेवर ने अभी तक कोई विवरण नहीं लिखा है।" : "This professional has not provided a description yet.")}
            </p>
          </div>

          {/* Services areas list */}
          {worker.serviceAreas && worker.serviceAreas.length > 0 && (
            <div className="pt-6 mt-6 border-t border-gray-100">
              <h3 className="text-sm font-bold text-zinc-900 mb-2">
                {language === "hi" ? "सेवा क्षेत्र (स्थान):" : "Service Locations:"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {worker.serviceAreas.map((area, i) => (
                  <span key={i} className="bg-zinc-100 text-zinc-700 text-xs px-2.5 py-1 rounded-md border border-zinc-200">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
            <span>{language === "hi" ? "ग्राहक समीक्षाएं" : "Customer Reviews"}</span>
            <span className="bg-zinc-100 text-zinc-700 text-xs font-bold px-2 py-0.5 rounded-full border">
              {worker.totalReviews}
            </span>
          </h2>

          {loadingReviews ? (
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-10 bg-zinc-100 rounded-md w-full"></div>
              <div className="h-10 bg-zinc-100 rounded-md w-full"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-zinc-400 text-sm">
                {language === "hi" ? "अभी तक कोई समीक्षा नहीं है।" : "No reviews submitted for this worker yet."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {reviews.map((r) => (
                <div key={r._id} className="pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-zinc-800 truncate">{r.userId?.name || "Client"}</h4>
                      <p className="text-[10px] text-zinc-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 shrink-0 ${
                            i < r.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {r.comment && (
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed break-words">
                      {r.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: CTA Dialer and Leave a Review */}
      <div className="flex flex-col gap-6">


        {/* Leave a Review (Only show rating form to users who aren't the worker themselves) */}
        {currentUserId !== worker.userId ? (
          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4">
              {hasReviewed && myReview
                ? (language === "hi" ? "समीक्षा सबमिट की गई" : "Review Submitted")
                : (language === "hi" ? "काम कैसा था? रेटिंग दें" : "Submit a Rating")}
            </h3>

            {!isAuthenticated ? (
              <p className="text-xs text-zinc-400 text-center py-4 bg-zinc-50 border border-gray-100 rounded-lg">
                {language === "hi" ? "रेटिंग सबमिट करने के लिए" : "Please"}{" "}
                <Link href="/login" className="text-orange-600 hover:underline font-bold">
                  {language === "hi" ? "लॉगिन करें" : "log in"}
                </Link>{" "}
                {language === "hi" ? "" : "to leave a review."}
              </p>
            ) : hasReviewed && myReview ? (
              <div className="flex flex-col gap-4">
                <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-4 flex flex-col items-stretch">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                      {language === "hi" ? "आपकी रेटिंग" : "Your Rating"}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 shrink-0 ${
                            i < myReview.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {myReview.comment && (
                    <p className="text-xs text-zinc-600 leading-relaxed italic bg-white p-3 rounded-lg border border-zinc-200/50 break-words">
                      "{myReview.comment}"
                    </p>
                  )}
                  <p className="text-[9px] text-zinc-400 mt-2 text-right">
                    {new Date(myReview.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-lg text-xs border border-red-200 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 shrink-0" />
                  <span>{language === "hi" ? "रेटिंग हटाएं" : "Delete Rating"}</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                {/* Rating select stars */}
                <div>
                  <label className="text-xs text-zinc-500 font-bold block mb-1.5">
                    {language === "hi" ? "रेटिंग:" : "Rating:"}
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingInput(star)}
                        className="cursor-pointer hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-7 w-7 shrink-0 ${
                            star <= ratingInput ? "fill-amber-400 text-amber-400" : "text-zinc-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment area */}
                <div>
                  <label className="text-xs text-zinc-500 font-bold block mb-1.5">
                    {language === "hi" ? "समीक्षा लिखें (वैकल्पिक):" : "Review details (Optional):"}
                  </label>
                  <textarea
                    rows={3}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder={language === "hi" ? "काम के बारे में अपना अनुभव बताएं..." : "Describe your service experience..."}
                    className="w-full text-xs sm:text-sm p-3 border border-zinc-250 rounded-lg focus:outline-none focus:border-amber-500 placeholder-zinc-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white font-bold py-2.5 rounded-lg text-xs hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5 shrink-0" />
                  <span>{submittingReview ? (language === "hi" ? "सबमिट हो रहा है..." : "Submitting...") : (language === "hi" ? "रेटिंग सबमिट करें" : "Post Rating")}</span>
                </button>

                {submitError && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 font-medium">
                    {submitError}
                  </p>
                )}
                {submitSuccess && (
                  <p className="text-xs text-green-600 bg-green-50 p-2.5 rounded-lg border border-green-100 font-medium">
                    {submitSuccess}
                  </p>
                )}
              </form>
            )}
          </div>
        ) : (
          <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-6 text-center text-zinc-500">
            <p className="text-xs font-semibold">
              {language === "hi" ? "यह आपकी स्वयं की प्रोफ़ाइल है।" : "This is your own profile."}
            </p>
          </div>
        )}
      </div>
    </div>

    {/* Custom Confirmation Modal */}
    {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 transform scale-100 transition-transform duration-300 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 border border-red-100">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">
                {language === "hi" ? "समीक्षा हटाएं?" : "Delete Review?"}
              </h3>
              <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                {language === "hi"
                  ? "क्या आप वाकई अपनी समीक्षा हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।"
                  : "Are you sure you want to delete your review? This action cannot be undone."}
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2.5 px-4 text-xs font-bold border border-zinc-200 text-zinc-700 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  {language === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  onClick={handleDeleteReview}
                  className="flex-1 py-2.5 px-4 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-600/20 transition-all cursor-pointer"
                >
                  {language === "hi" ? "समीक्षा हटाएं" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
