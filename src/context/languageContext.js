"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const translations = {
  en: {
    brand: "WorkerNear",
    findServices: "Find Services",
    howItWorks: "How it Works",
    becomePro: "Become a Worker",
    login: "Login",
    register: "Register",
    heroTitle: "Find local workers for any project.",
    heroSubtitle: "Trusted workers in your community, ready to help.",
    locationPlaceholder: "Your location",
    searchPlaceholder: "Find trusted workers near you...",
    searchButton: "Search",
    popularTitle: "Popular Services",
    viewAll: "View all categories",
    acRepair: "AC Repair",
    plumbing: "Plumbing",
    electrical: "Electrical",
    applianceRepair: "Appliance Repair",
    houseCleaning: "House Cleaning",
    gardening: "Gardening",
    astrologers: "Astrologers",
    topProfessionals: "Top Workers",
    reviews: "reviews",
    plumber: "Plumber",
    cleaner: "Cleaner",
    handyman: "Handyman",
    electrician: "Electrician",
    footerDesc: "Connecting you with trusted local workers for all your home service needs.",
    company: "Company",
    aboutUs: "About Us",
    contact: "Contact",
    support: "Support",
    safetyTrust: "Safety & Trust",
    workerSupport: "Worker Support",
    legal: "Legal",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    rightsReserved: "© 2026 Workers Marketplace. All rights reserved.",
    myProfile: "My Profile",
    myBookings: "My Bookings",
    logout: "Logout",
    welcomeBack: "Welcome Back",
    loginSubtitle: "Enter your email or phone number and password to access your account",
    emailOrPhone: "Email or Phone Number",
    emailOrPhonePlaceholder: "name@example.com or phone number",
    phoneNumber: "Phone Number",
    phonePlaceholder: "Enter your phone number",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    dontHaveAccount: "Don't Have An Account?",
    registerTitle: "Register Now",
    registerSubtitle: "Enter your details to register your account",
    fullName: "Full Name",
    namePlaceholder: "Full Name",
    email: "Email Address",
    emailPlaceholder: "name@example.com",
    optional: "Optional",
    alreadyHaveAccount: "Already Have An Account?",
    role: "Register As",
    roleUser: "Customer (Looking for Services)",
    roleWorker: "Worker (Offering Services)",
    availability: "Availability",
    dashboard: "Dashboard",
    city: "City",
    area: "Area/Location",
    cityPlaceholder: "Select or enter city",
    areaPlaceholder: "Enter area/locality",
    workersNearYou: "Workers Near You",
    showingWorkersIn: "Showing workers in",
    changeLocation: "Change Location",
    useCurrentLocation: "Use Current Location",
    providerRegSuccess: "Registration successful! Please log in to create & complete your profile to get admin approval.",
    completeProfileTitle: "Action Required: Complete Your Profile",
    completeProfileDesc: "Please complete your worker details (profession, categories, experience, description, location) so our administrators can review and approve your profile to show in search results.",
    completeProfileButton: "Complete Profile Now",
    awaitingApprovalTitle: "Profile Submitted - Awaiting Admin Approval",
    awaitingApprovalDesc: "Thank you for submitting your profile! Your account details are under review by our team. Once approved, your services will appear in search results.",
    profileUpdatedPendingApproval: "Worker profile saved! Your details are pending admin approval. We will activate your listing once verified.",
    sortNearby: "Most Nearby",
    sortMostReviewed: "Most Reviewed",
    sortTopRated: "Highest Rated",
    showingResultsCount: "Showing workers"
  },
  hi: {
    brand: "WorkerNear",
    findServices: "सेवाएं खोजें",
    howItWorks: "यह कैसे काम करता है",
    becomePro: "वर्कर बनें",
    login: "लॉगिन",
    register: "पंजीकरण",
    heroTitle: "किसी भी काम के लिए स्थानीय वर्कर खोजें।",
    heroSubtitle: "आपके समुदाय में विश्वसनीय वर्कर, मदद के लिए तैयार।",
    locationPlaceholder: "आपका स्थान",
    searchPlaceholder: "अपने आस-पास विश्वसनीय वर्कर खोजें...",
    searchButton: "खोजें",
    popularTitle: "लोकप्रिय सेवाएं",
    viewAll: "सभी श्रेणियां देखें",
    acRepair: "एसी मरम्मत",
    plumbing: "प्लंबिंग",
    electrical: "इलेक्ट्रिकल",
    applianceRepair: "उपकरण मरम्मत",
    houseCleaning: "घर की सफाई",
    gardening: "बागवानी",
    astrologers: "ज्योतिषी",
    topProfessionals: "शीर्ष वर्कर",
    reviews: "समीक्षाएं",
    plumber: "प्लम्बर",
    cleaner: "क्लीनर",
    handyman: "हैंडीमैन",
    electrician: "इलेक्ट्रीशियन",
    footerDesc: "आपकी सभी घरेलू सेवा आवश्यकताओं के लिए आपको विश्वसनीय स्थानीय वर्कर से जोड़ना।",
    company: "कंपनी",
    aboutUs: "हमारे बारे में",
    contact: "संपर्क करें",
    support: "सहायता",
    safetyTrust: "सुरक्षा और विश्वास",
    workerSupport: "कार्यकर्ता सहायता",
    legal: "कानूनी",
    privacyPolicy: "गोपनीयता नीति",
    termsOfService: "सेवा की शर्तें",
    rightsReserved: "© 2026 वर्कर्स मार्केटप्लेस। सर्वाधिकार सुरक्षित।",
    myProfile: "मेरी प्रोफ़ाइल",
    myBookings: "मेरी बुकिंग",
    logout: "लॉगआउट",
    welcomeBack: "आपका स्वागत है",
    loginSubtitle: "अपने खाते में प्रवेश करने के लिए अपना ईमेल या फ़ोन नंबर और पासवर्ड दर्ज करें",
    emailOrPhone: "ईमेल या फ़ोन नंबर",
    emailOrPhonePlaceholder: "name@example.com या फ़ोन नंबर",
    phoneNumber: "फ़ोन नंबर",
    phonePlaceholder: "अपना फ़ोन नंबर दर्ज करें",
    password: "पासवर्ड",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    dontHaveAccount: "क्या आपके पास खाता नहीं है?",
    registerTitle: "अभी पंजीकरण करें",
    registerSubtitle: "अपना खाता पंजीकृत करने के लिए अपना विवरण दर्ज करें",
    fullName: "पूरा नाम",
    namePlaceholder: "पूरा नाम",
    email: "ईमेल आईडी",
    emailPlaceholder: "name@example.com",
    optional: "वैकल्पिक",
    alreadyHaveAccount: "क्या आपके पास पहले से एक खाता है?",
    role: "इस रूप में पंजीकृत करें",
    roleUser: "ग्राहक / उपयोगकर्ता (सेवाओं की तलाश में)",
    roleWorker: "वर्कर / कारीगर (सेवाएं प्रदान करने के लिए)",
    availability: "उपलब्धता",
    dashboard: "डैशबोर्ड",
    city: "शहर",
    area: "क्षेत्र/लोकेशन",
    cityPlaceholder: "शहर चुनें या दर्ज करें",
    areaPlaceholder: "क्षेत्र दर्ज करें",
    workersNearYou: "आपके आस-पास के वर्कर",
    showingWorkersIn: "यहाँ वर्कर दिखा रहे हैं:",
    changeLocation: "स्थान बदलें",
    useCurrentLocation: "वर्तमान स्थान का उपयोग करें",
    providerRegSuccess: "पंजीकरण सफल! कृपया व्यवस्थापक स्वीकृति प्राप्त करने के लिए अपनी प्रोफ़ाइल पूरी करने हेतु लॉगिन करें।",
    completeProfileTitle: "कार्रवाई आवश्यक: अपनी प्रोफ़ाइल पूरी करें",
    completeProfileDesc: "कृपया अपना वर्कर विवरण (व्यवसाय, श्रेणियां, अनुभव, विवरण, स्थान) पूरा करें ताकि हमारे प्रशासक खोज परिणामों में दिखने के लिए आपकी प्रोफ़ाइल की समीक्षा और स्वीकृति दे सकें।",
    completeProfileButton: "अभी प्रोफ़ाइल पूरी करें",
    awaitingApprovalTitle: "प्रोफ़ाइल सबमिट की गई - व्यवस्थापक स्वीकृति की प्रतीक्षा है",
    awaitingApprovalDesc: "अपनी प्रोफ़ाइल पूरी करने के लिए धन्यवाद! आपकी खाता जानकारी वर्तमान में हमारे प्रशासकों द्वारा समीक्षाधीन है। स्वीकृत होने के बाद आप खोज परिणामों में प्रदर्शित होंगे।",
    profileUpdatedPendingApproval: "वर्कर प्रोफ़ाइल सहेजी गई! आपकी प्रोफ़ाइल व्यवस्थापक स्वीकृति के लिए लंबित है। विवरण सत्यापित होने पर हम आपकी सूची सक्रिय करेंगे।",
    sortNearby: "निकटतम स्थान",
    sortMostReviewed: "सर्वाधिक समीक्षाएं",
    sortTopRated: "उच्चतम रेटिंग",
    showingResultsCount: "वर्कर दिखाए जा रहे हैं"
  }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  // Synchronize language preference from URL param, localStorage, or cookie
  const syncLanguage = () => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const langParam = params.get("lang");
      if (langParam === "en" || langParam === "hi") {
        setLanguage(langParam);
        localStorage.setItem("preferredLanguage", langParam);
        document.cookie = `preferredLanguage=${langParam}; path=/; max-age=31536000; SameSite=Lax`;
        return;
      }
      const savedLanguage = localStorage.getItem("preferredLanguage");
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "hi")) {
        setLanguage(savedLanguage);
      }
    } catch (e) {
      console.error("Language sync error:", e);
    }
  };

  useEffect(() => {
    syncLanguage();

    // Listen to back/forward cache restore, history changes, and storage events
    const handlePageShow = () => syncLanguage();
    const handlePopState = () => syncLanguage();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncLanguage();
      }
    };
    const handleStorage = (e) => {
      if (e.key === "preferredLanguage" && (e.newValue === "en" || e.newValue === "hi")) {
        setLanguage(e.newValue);
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "hi" : "en";
    setLanguage(nextLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredLanguage", nextLang);
      document.cookie = `preferredLanguage=${nextLang}; path=/; max-age=31536000; SameSite=Lax`;
    }
  };

  const setSpecificLanguage = (lang) => {
    if (lang === "en" || lang === "hi") {
      setLanguage(lang);
      if (typeof window !== "undefined") {
        localStorage.setItem("preferredLanguage", lang);
        document.cookie = `preferredLanguage=${lang}; path=/; max-age=31536000; SameSite=Lax`;
      }
    }
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setSpecificLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
