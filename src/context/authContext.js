"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";

const AuthContext = createContext(null);

const BACKEND_URL = API_BASE_URL;

const normalizeLocation = (rawCity, rawArea) => {
  let city = rawCity || "";
  let area = rawArea || "";
  
  city = city.trim();
  area = area.trim();

  // Normalize City
  if (/mumbai/i.test(city)) {
    if (/navi/i.test(city) || /navi/i.test(area)) {
      city = "Navi Mumbai";
    } else {
      city = "Mumbai";
    }
  } else if (/delhi/i.test(city)) {
    city = "Delhi";
  } else if (/pune/i.test(city)) {
    city = "Pune";
  } else if (/bangalore/i.test(city) || /bengaluru/i.test(city)) {
    city = "Bangalore";
  }
  
  // Normalize Area if possible to match seeded areas
  const knownAreas = ["Belapur", "Seawoods", "Nerul", "Kharghar", "Vashi"];
  const matchedArea = knownAreas.find(a => new RegExp(a, "i").test(area) || new RegExp(a, "i").test(city));
  if (matchedArea) {
    area = matchedArea;
  }
  
  return { city, area };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({ city: "Mumbai", area: "Belapur", country: "India" });

  // Set auth token in cookies (for SSR access) and localStorage
  const setAuthSession = (token, refreshToken, userData, workerData) => {
    if (token) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(userData));
      if (workerData) {
        localStorage.setItem("authWorker", JSON.stringify(workerData));
      } else {
        localStorage.removeItem("authWorker");
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      
      // Save token to cookie with 7 days expiration for SSR
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      document.cookie = `authToken=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      
      setUser(userData);
      setWorkerProfile(workerData || null);
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authUser");
      localStorage.removeItem("authWorker");
      document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
      setUser(null);
      setWorkerProfile(null);
    }
  };

  // Helper to call backend /refresh endpoint and get a new access token
  const refreshSession = async () => {
    const savedRefreshToken = localStorage.getItem("refreshToken");
    if (!savedRefreshToken) {
      return false;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/user/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refreshToken: savedRefreshToken })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("authToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        document.cookie = `authToken=${data.accessToken}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
        
        return data.accessToken;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Failed to refresh token:", err);
      return false;
    }
  };

  // Load user session on mount
  useEffect(() => {
    const fetchSession = async () => {
      const savedToken = localStorage.getItem("authToken");
      const savedUser = localStorage.getItem("authUser");
      const savedWorker = localStorage.getItem("authWorker");

      if (savedToken && savedUser) {
        setUser(JSON.parse(savedUser));
        if (savedWorker) {
          setWorkerProfile(JSON.parse(savedWorker));
        }

        // Validate token with server to keep it fresh
        try {
          const res = await fetch(`${BACKEND_URL}/user/me`, {
            headers: {
              Authorization: `Bearer ${savedToken}`
            }
          });
          const data = await res.json();
          if (data.success) {
            setUser(data.user);
            setWorkerProfile(data.workerProfile || null);
            localStorage.setItem("authUser", JSON.stringify(data.user));
            if (data.workerProfile) {
              localStorage.setItem("authWorker", JSON.stringify(data.workerProfile));
            } else {
              localStorage.removeItem("authWorker");
            }
          } else {
            // Token invalid or expired, try refreshing
            const newAccessToken = await refreshSession();
            if (newAccessToken) {
              const retryRes = await fetch(`${BACKEND_URL}/user/me`, {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`
                }
              });
              const retryData = await retryRes.json();
              if (retryData.success) {
                setUser(retryData.user);
                setWorkerProfile(retryData.workerProfile || null);
                localStorage.setItem("authUser", JSON.stringify(retryData.user));
                if (retryData.workerProfile) {
                  localStorage.setItem("authWorker", JSON.stringify(retryData.workerProfile));
                } else {
                  localStorage.removeItem("authWorker");
                }
              } else {
                setAuthSession(null);
              }
            } else {
              setAuthSession(null);
            }
          }
        } catch (err) {
          console.error("Auth validation failed:", err);
          // Try validating using refresh token on validation errors (e.g. timeout / temporary token fail)
          const newAccessToken = await refreshSession();
          if (!newAccessToken) {
            console.log("Could not validate or refresh session. Logged out.");
          }
        }
      } else if (localStorage.getItem("refreshToken")) {
        // Access token missing but refresh token exists, restore session
        const newAccessToken = await refreshSession();
        if (newAccessToken) {
          try {
            const res = await fetch(`${BACKEND_URL}/user/me`, {
              headers: {
                Authorization: `Bearer ${newAccessToken}`
              }
            });
            const data = await res.json();
            if (data.success) {
              setUser(data.user);
              setWorkerProfile(data.workerProfile || null);
              localStorage.setItem("authUser", JSON.stringify(data.user));
              if (data.workerProfile) {
                localStorage.setItem("authWorker", JSON.stringify(data.workerProfile));
              }
            } else {
              setAuthSession(null);
            }
          } catch (err) {
            console.error("Session recovery profile fetch failed:", err);
          }
        } else {
          setAuthSession(null);
        }
      }
      setLoading(false);
    };

    fetchSession();
  }, []);

  // Silent token refresh timer and focus restoration
  useEffect(() => {
    if (!user) return;

    // Silent refresh every 10 minutes to stay fresh
    const intervalId = setInterval(async () => {
      console.log("Performing periodic silent token refresh...");
      await refreshSession();
    }, 10 * 60 * 1000);

    // Refresh when user returns to/focuses the tab (e.g., wake from sleep)
    const handleFocus = async () => {
      console.log("Tab focused, restoring access token freshness...");
      await refreshSession();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [user]);

  const updateLocation = async (loc) => {
    const normalized = normalizeLocation(loc.city, loc.area);
    const country = loc.country || user?.country || currentLocation?.country || "India";
    const newLoc = { ...normalized, country };
    setCurrentLocation(newLoc);
    localStorage.setItem("currentLocation", JSON.stringify(newLoc));
    
    // If user is logged in, sync to backend profile
    const savedToken = localStorage.getItem("authToken");
    if (savedToken && user) {
      try {
        await fetch(`${BACKEND_URL}/user/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${savedToken}`
          },
          body: JSON.stringify({
            name: user.name,
            city: normalized.city,
            area: normalized.area,
            country: country
          })
        });
      } catch (err) {
        console.error("Failed to sync location to profile:", err);
      }
    }
  };

  const detectLocationByIP = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      if (data.city) {
        const normalized = normalizeLocation(data.city, data.org || "");
        updateLocation({ city: normalized.city, area: "", country: data.country_name || "" });
      } else {
        updateLocation({ city: "Mumbai", area: "Belapur", country: "India" });
      }
    } catch (err) {
      console.error("IP geolocation failed, using default:", err);
      updateLocation({ city: "Mumbai", area: "Belapur", country: "India" });
    }
  };

  const detectLocation = async (force = false) => {
    // If not forced and we already have a saved location, use it
    if (!force) {
      const savedLoc = localStorage.getItem("currentLocation");
      if (savedLoc) {
        try {
          const parsed = JSON.parse(savedLoc);
          if (parsed.city) {
            setCurrentLocation(parsed);
            return;
          }
        } catch (e) {}
      }
      if (user?.city) {
        setCurrentLocation({ city: user.city, area: user.area || "" });
        return;
      }
    }

    if (!navigator.geolocation) {
      await detectLocationByIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
          );
          const data = await response.json();
          const addr = data.address || {};
          const rawCity = addr.city || addr.town || addr.village || addr.state_district || addr.county || "";
          const rawArea = addr.suburb || addr.neighbourhood || addr.residential || addr.city_district || "";
          const rawCountry = addr.country || "";
          
          const normalized = normalizeLocation(rawCity, rawArea);
          updateLocation({ ...normalized, country: rawCountry });
        } catch (err) {
          console.error("Nominatim reverse geocoding failed, falling back to IP:", err);
          await detectLocationByIP();
        }
      },
      async (error) => {
        console.warn("Geolocation permission denied or failed, falling back to IP:", error);
        await detectLocationByIP();
      },
      { timeout: 8000 }
    );
  };

  useEffect(() => {
    if (!loading) {
      detectLocation();
    }
  }, [loading, user]);

  const login = async (phone, password) => {
    try {
      const res = await fetch(`${BACKEND_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to log in");
      }

      setAuthSession(data.data.token, data.data.refreshToken, data.data.user, data.data.workerProfile);
      return { success: true, user: data.data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (registerData) => {
    try {
      const res = await fetch(`${BACKEND_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(registerData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const requestPasswordReset = async (phone) => {
    try {
      const res = await fetch(`${BACKEND_URL}/user/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const resetPasswordWithOtp = async (phone, otp, newPassword) => {
    try {
      const res = await fetch(`${BACKEND_URL}/user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone, otp, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
      }
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setAuthSession(null);
    window.location.href = "/login";
  };

  const updateProfileState = (updatedWorker) => {
    setWorkerProfile(updatedWorker);
    localStorage.setItem("authWorker", JSON.stringify(updatedWorker));
  };

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("authUser", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workerProfile,
        loading,
        login,
        register,
        requestPasswordReset,
        resetPasswordWithOtp,
        logout,
        updateProfileState,
        updateUserState,
        currentLocation,
        updateLocation,
        detectLocation,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isWorker: user?.role === "provider"
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
