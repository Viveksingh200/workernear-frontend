"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const translations = {
  en: {
    brand: "WorkerNear",
    findServices: "Find Services",
    howItWorks: "How it Works",
    becomePro: "Become a Pro",
    login: "Login",
    register: "Register",
    heroTitle: "Find local pros for any project.",
    heroSubtitle: "Trusted professionals in your community, ready to help.",
    locationPlaceholder: "Your location",
    searchPlaceholder: "Find trusted professionals near you...",
    searchButton: "Search",
    popularTitle: "Popular Services",
    viewAll: "View all categories",
    acRepair: "AC Repair",
    plumbing: "Plumbing",
    electrical: "Electrical",
    applianceRepair: "Appliance Repair",
    houseCleaning: "House Cleaning",
    gardening: "Gardening",
    topProfessionals: "Top Professionals",
    reviews: "reviews",
    plumber: "Plumber",
    cleaner: "Cleaner",
    handyman: "Handyman",
    electrician: "Electrician",
    footerDesc: "Connecting you with trusted local professionals for all your home service needs.",
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
    loginSubtitle: "Enter your phone number and password to access your account",
    phoneNumber: "Phone Number",
    phonePlaceholder: "Enter your phone number",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    dontHaveAccount: "Don't Have An Account?",
    registerTitle: "Register Now",
    registerSubtitle: "Enter your details to register your account",
    fullName: "Full Name",
    namePlaceholder: "Full Name",
    email: "Email",
    emailPlaceholder: "Enter your email id",
    alreadyHaveAccount: "Already Have An Account?",
    role: "Register As",
    roleUser: "User (Looking for Services)",
    roleWorker: "Worker (Offering Services)",
    availability: "Availability",
    dashboard: "Dashboard",
    city: "City",
    area: "Area/Location",
    cityPlaceholder: "Select or enter city",
    areaPlaceholder: "Enter area/locality",
    workersNearYou: "Workers Near You",
    showingWorkersIn: "Showing professionals in",
    changeLocation: "Change Location",
    useCurrentLocation: "Use Current Location",
    providerRegSuccess: "Registration successful! Please log in to create & complete your profile to get admin approval.",
    completeProfileTitle: "Action Required: Complete Your Profile",
    completeProfileDesc: "Please complete your professional details (profession, categories, experience, description, location) so our administrators can review and approve your profile to show in search results.",
    completeProfileButton: "Complete Profile Now",
    awaitingApprovalTitle: "Profile Submitted - Awaiting Admin Approval",
    awaitingApprovalDesc: "Thank you for submitting your profile! Your account details are under review by our team. Once approved, your services will appear in search results.",
    profileUpdatedPendingApproval: "Professional profile saved! Your details are pending admin approval. We will activate your listing once verified.",
    sortNearby: "Most Nearby",
    sortMostReviewed: "Most Reviewed",
    sortTopRated: "Highest Rated",
    showingResultsCount: "Showing professionals"
  },
  hi: {
    brand: "WorkerNear",
    findServices: "सेवाएं खोजें",
    howItWorks: "यह कैसे काम करता है",
    becomePro: "प्रो बनें",
    login: "लॉगिन",
    register: "पंजीकरण",
    heroTitle: "किसी भी प्रोजेक्ट के लिए स्थानीय पेशेवर खोजें।",
    heroSubtitle: "आपके समुदाय में विश्वसनीय पेशेवर, मदद के लिए तैयार।",
    locationPlaceholder: "आपका स्थान",
    searchPlaceholder: "अपने आस-पास विश्वसनीय पेशेवरों को खोजें...",
    searchButton: "खोजें",
    popularTitle: "लोकप्रिय सेवाएं",
    viewAll: "सभी श्रेणियां देखें",
    acRepair: "एसी मरम्मत",
    plumbing: "प्लंबिंग",
    electrical: "इलेक्ट्रिकल",
    applianceRepair: "उपकरण मरम्मत",
    houseCleaning: "घर की सफाई",
    gardening: "बागवानी",
    topProfessionals: "शीर्ष पेशेवर",
    reviews: "समीक्षाएं",
    plumber: "प्लम्बर",
    cleaner: "क्लीनर",
    handyman: "हैंडीमैन",
    electrician: "इलेक्ट्रीशियन",
    footerDesc: "आपकी सभी घरेलू सेवा आवश्यकताओं के लिए आपको विश्वसनीय स्थानीय पेशेवरों से जोड़ना।",
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
    loginSubtitle: "अपने खाते में प्रवेश करने के लिए अपना फ़ोन नंबर और पासवर्ड दर्ज करें",
    phoneNumber: "फ़ोन नंबर",
    phonePlaceholder: "अपना फ़ोन नंबर दर्ज करें",
    password: "पासवर्ड",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    dontHaveAccount: "क्या आपके पास खाता नहीं है?",
    registerTitle: "अभी पंजीकरण करें",
    registerSubtitle: "अपना खाता पंजीकृत करने के लिए अपना विवरण दर्ज करें",
    fullName: "पूरा नाम",
    namePlaceholder: "पूरा नाम",
    email: "ईमेल",
    emailPlaceholder: "अपना ईमेल आईडी दर्ज करें",
    alreadyHaveAccount: "क्या आपके पास पहले से एक खाता है?",
    role: "इस रूप में पंजीकृत करें",
    roleUser: "उपयोगकर्ता (सेवाओं की तलाश में)",
    roleWorker: "पेशेवर / कार्यकर्ता (सेवाएं प्रदान करने के लिए)",
    availability: "उपलब्धता",
    dashboard: "डैशबोर्ड",
    city: "शहर",
    area: "क्षेत्र/लोकेशन",
    cityPlaceholder: "शहर चुनें या दर्ज करें",
    areaPlaceholder: "क्षेत्र दर्ज करें",
    workersNearYou: "आपके आस-पास के पेशेवर",
    showingWorkersIn: "यहाँ पेशेवर दिखा रहे हैं:",
    changeLocation: "स्थान बदलें",
    useCurrentLocation: "वर्तमान स्थान का उपयोग करें",
    providerRegSuccess: "पंजीकरण सफल! कृपया व्यवस्थापक स्वीकृति प्राप्त करने के लिए अपनी प्रोफ़ाइल पूरी करने हेतु लॉगिन करें।",
    completeProfileTitle: "कार्रवाई आवश्यक: अपनी प्रोफ़ाइल पूरी करें",
    completeProfileDesc: "कृपया अपना व्यावसायिक विवरण (व्यवसाय, श्रेणियां, अनुभव, विवरण, स्थान) पूरा करें ताकि हमारे प्रशासक खोज परिणामों में दिखने के लिए आपकी प्रोफ़ाइल की समीक्षा और स्वीकृति दे सकें।",
    completeProfileButton: "अभी प्रोफ़ाइल पूरी करें",
    awaitingApprovalTitle: "प्रोफ़ाइल सबमिट की गई - व्यवस्थापक स्वीकृति की प्रतीक्षा है",
    awaitingApprovalDesc: "अपनी प्रोफ़ाइल पूरी करने के लिए धन्यवाद! आपकी खाता जानकारी वर्तमान में हमारे प्रशासकों द्वारा समीक्षाधीन है। स्वीकृत होने के बाद आप खोज परिणामों में प्रदर्शित होंगे।",
    profileUpdatedPendingApproval: "व्यावसायिक प्रोफ़ाइल सहेजी गई! आपकी प्रोफ़ाइल व्यवस्थापक स्वीकृति के लिए लंबित है। विवरण सत्यापित होने पर हम आपकी सूची सक्रिय करेंगे।",
    sortNearby: "निकटतम स्थान",
    sortMostReviewed: "सर्वाधिक समीक्षाएं",
    sortTopRated: "उच्चतम रेटिंग",
    showingResultsCount: "पेशेवर दिखाए जा रहे हैं"
  }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  // Load language preference from search parameter, or local storage on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get("lang");
    if (langParam === "en" || langParam === "hi") {
      setLanguage(langParam);
      localStorage.setItem("preferredLanguage", langParam);
      return;
    }
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "hi")) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "hi" : "en";
    setLanguage(nextLang);
    localStorage.setItem("preferredLanguage", nextLang);
  };

  const setSpecificLanguage = (lang) => {
    if (lang === "en" || lang === "hi") {
      setLanguage(lang);
      localStorage.setItem("preferredLanguage", lang);
    }
  };

  const t = translations[language];

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
