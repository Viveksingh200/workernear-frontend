"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const { requestPasswordReset, resetPasswordWithOtp } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!phone) {
      setError("Please enter your phone number");
      setLoading(false);
      return;
    }

    const res = await requestPasswordReset(phone);
    if (res.success) {
      setSuccess("OTP sent successfully (Use 123456 for testing)");
      setStep(2);
    } else {
      setError(res.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!otp || !newPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const res = await resetPasswordWithOtp(phone, otp, newPassword);
    if (res.success) {
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setError(res.message || "Failed to reset password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-zinc-100">
      <div className="bg-white px-8 py-10 rounded-xl shadow-sm w-full max-w-md border border-zinc-200/50">
        
        <div className="mb-6">
          <Link href="/login" className="flex items-center text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors w-fit">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
          </Link>
        </div>

        <div className="flex flex-col justify-center gap-1 mb-6">
          <h2 className="font-bold text-3xl text-zinc-900">Reset Password</h2>
          <p className="text-zinc-400 md:text-sm text-xs">
            {step === 1 ? "Enter your phone number to receive an OTP." : "Enter the OTP and your new password."}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-lg border border-red-100 mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 text-xs font-semibold p-3 rounded-lg border border-green-100 mb-4">
            {success}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="flex flex-col gap-6 w-full">
            <div className="flex flex-col">
              <label htmlFor="phone" className="text-zinc-700 font-semibold text-sm">
                Phone Number
              </label>
              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., 9876543210"
                className="px-4 py-2 mt-2 border border-zinc-200 rounded-md outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm text-zinc-900 placeholder-zinc-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg px-4 py-2.5 text-base tracking-wide font-semibold cursor-pointer shadow-md shadow-orange-500/10 hover:shadow-orange-500/25 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-6 w-full">
            <div className="flex flex-col">
              <label htmlFor="otp" className="text-zinc-700 font-semibold text-sm">
                OTP
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="px-4 py-2 mt-2 border border-zinc-200 rounded-md outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm text-zinc-900 placeholder-zinc-400"
                required
              />

              <label htmlFor="newPassword" className="pt-4 text-zinc-700 font-semibold text-sm">
                New Password
              </label>
              <div className="relative mt-2">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-2 pr-10 border border-zinc-200 rounded-md outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm text-zinc-900 placeholder-zinc-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer flex items-center"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg px-4 py-2.5 text-base tracking-wide font-semibold cursor-pointer shadow-md shadow-orange-500/10 hover:shadow-orange-500/25 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
