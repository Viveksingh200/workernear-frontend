"use client";

import React, { useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/authContext";
import { GOOGLE_CLIENT_ID } from "@/config";

function GoogleSignInButton({ role = "user", redirectUrl = "", text = "Continue with Google", onError }) {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (!tokenResponse?.access_token) {
        if (onError) onError("Google authentication failed. No access token received.");
        return;
      }

      setLoading(true);
      try {
        const res = await loginWithGoogle(null, role, tokenResponse.access_token);
        if (res.success) {
          const userRole = res.user?.role;
          if (redirectUrl && redirectUrl.startsWith("/")) {
            window.location.replace(redirectUrl);
          } else if (userRole === "admin") {
            window.location.replace("/admin");
          } else if (userRole === "provider") {
            window.location.replace("/worker/dashboard");
          } else {
            window.location.replace("/");
          }
        } else {
          if (onError) onError(res.message || "Google authentication failed.");
        }
      } catch (err) {
        if (onError) onError(err.message || "Google authentication failed.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      if (onError) onError("Google sign-in was cancelled or failed.");
    }
  });

  const buttonText = text === "signin_with" ? "Continue with Google" : text;

  return (
    <button
      type="button"
      onClick={() => handleLogin()}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-all cursor-pointer shadow-sm hover:border-zinc-300 dark:hover:border-zinc-600 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
      )}
      <span>{loading ? "Connecting to Google..." : buttonText}</span>
    </button>
  );
}

export default function GoogleAuthButton(props) {
  if (!GOOGLE_CLIENT_ID) {
    return (
      <button
        type="button"
        onClick={() => {
          if (props.onError) props.onError("Google Client ID is not configured. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID in your .env.local file.");
        }}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-all cursor-pointer shadow-sm hover:border-zinc-300 dark:hover:border-zinc-600"
      >
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleSignInButton {...props} />
    </GoogleOAuthProvider>
  );
}
