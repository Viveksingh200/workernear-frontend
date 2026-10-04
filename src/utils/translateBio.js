/**
 * Translation utility for worker bios & descriptions
 * Converts English worker bios into natural, accurate Hindi when language is set to 'hi'.
 */

const exactTranslations = {
  // Astrologers
  "9 Years of Experience in Vedic astrology, Horoscope analysis, matchmaking, and personalized spiritual guidance.":
    "वैदिक ज्योतिष, कुंडली विश्लेषण, गुण मिलान और व्यक्तिगत आध्यात्मिक मार्गदर्शन में 9 वर्षों का अनुभव।",

  "17 Years of Experience. Specializing in Vastu Consultation, Astrological Guidance, and spiritual healing solutions.":
    "17 वर्षों का अनुभव। वास्तु परामर्श, ज्योतिषीय मार्गदर्शन और आध्यात्मिक हीलिंग समाधानों में विशेषज्ञता।",

  "46 Years of Experience. Expert in Kundali Matching, Vastu, and Jyotish consultations for all life problems.":
    "46 वर्षों का अनुभव। जीवन की सभी समस्याओं के लिए कुंडली मिलान, वास्तु और ज्योतिष परामर्श के विशेषज्ञ।",

  "16 Years of Experience in Vastu Consultation, Navchandi Yagya, Vedic Puja, and accurate astrological predictions.":
    "16 वर्षों का अनुभव। वास्तु परामर्श, नवचंडी यज्ञ, वैदिक पूजा और सटीक ज्योतिषीय भविष्यवाणियों में विशेषज्ञ।",

  "7 Years of Experience in Tarot Astrology, Chakra Energy Healing, Horoscope Reading, and Vastu Consultancy.":
    "7 वर्षों का अनुभव। टैरो ज्योतिष, चक्र ऊर्जा हीलिंग, कुंडली पठन और वास्तु परामर्श में विशेषज्ञ।",

  "24 Years of Experience. Specializing in Kundali Matching, Satyanarayan Katha, Vedic Rituals, and Horoscope consultations.":
    "24 वर्षों का अनुभव। कुंडली मिलान, सत्यनारायण कथा, वैदिक अनुष्ठान और कुंडली परामर्श में विशेषज्ञता।",

  "7 Years of Experience in Vastu Consultation, Space Energy Healing, and Astrological remedies.":
    "7 वर्षों का अनुभव। वास्तु परामर्श, स्पेस एनर्जी हीलिंग और ज्योतिषीय उपायों में विशेषज्ञ।",

  "10 Years of Experience in Vastu Consultation, Kundali Analysis, and tailor-made Astro-Vastu solutions.":
    "10 वर्षों का अनुभव। वास्तु परामर्श, कुंडली विश्लेषण और अनुकूलित एस्ट्रो-वास्तु समाधानों में विशेषज्ञ।",

  "Scientific and energy-based Vastu consultation, practical remedies, tarot readings, and spiritual guidance.":
    "वैज्ञानिक एवं ऊर्जा-आधारित वास्तु परामर्श, व्यावहारिक उपाय, टैरो रीडिंग और आध्यात्मिक मार्गदर्शन।",

  "16 Years of Experience in Vastu Shastra, Hawan/Puja rituals, Horoscope matching, and Vedic astrology.":
    "16 वर्षों का अनुभव। वास्तु शास्त्र, हवन/पूजा अनुष्ठान, कुंडली मिलान और वैदिक ज्योतिष में विशेषज्ञ।",

  // Core & Other Professionals
  "I am a professional graphic designer": "मैं एक पेशेवर ग्राफिक डिजाइनर हूं।",
  "I create websites": "मैं आधुनिक और सुंदर वेबसाइटें बनाता हूं।",
  "I cook food for wedding": "मैं शादियों और विशेष आयोजनों के लिए स्वादिष्ट भोजन बनाता हूं।",
  "Specializing in custom carpentry, interior woodwork, modular kitchen setup, furniture repairs, and home renovations. Located near Mafatlal Ground, Kalwa, Thane.":
    "कस्टम बढ़ईगीरी (कारपेंटर), इंटीरियर वुडवर्क, मॉड्यूलर किचन, फर्नीचर मरम्मत और घर के नवीनीकरण में विशेषज्ञ। मफतलाल ग्राउंड के पास, कलवा, ठाणे।",
  "Professional carpentry, furniture making, woodwork repairs, and home interior services. Located at Room No 07 Chawl No 05 D.J.3, Near By Vitthal Mandir, Sabe Gaon, Diva, Thane-400612.":
    "पेशेवर बढ़ईगीरी, फर्नीचर निर्माण, लकड़ी की मरम्मत और होम इंटीरियर सेवाएं। दिवा, ठाणे।",
  "Python Tester & Android UI Developer, skilled in Python testing and designing modern, user-friendly Android interfaces.":
    "पायथन टेस्टर और एंड्रॉइड यूआई डेवलपर, आधुनिक और उपयोगकर्ता के अनुकूल ऐप इंटरफेस डिजाइन करने में कुशल।",
  "Shop No 2, Vishwakarma Society, Ashok Nagar, Ghartan Pada No 2, Ganesh Mandir Road, Ashok Nagar, Dahisar East, Mumbai-400068, Maharashtra. Professional AC Repair, Installation & Servicing.":
    "पेशेवर एसी रिपेयर, इंस्टॉलेशन और सर्विसिंग सेवाएं। दहिसर ईस्ट, मुंबई।",
  "Cool Tech - Professional Washing Machine Repair & Appliance Maintenance Services. Address: Room No - 9, Building Name - Fatima Chawl, Sanjay Nagar, Near By Rani Sati Marg, Pathan Wadi Road, Sanjay Nagar-Malad East, Mumbai-400097, Maharashtra.":
    "कूल टेक - पेशेवर वाशिंग मशीन रिपेयर और घरेलू उपकरण रखरखाव सेवाएं। मलाड ईस्ट, मुंबई।",
  "Imtiyaz Car Repair - Professional Car Maintenance, Engine Repair & Automobile Servicing. Address: Jayanti Villa Ground Floor, Shop No 01, G M Bhosle Marg, Worli, Mumbai-400018, Maharashtra.":
    "इम्तियाज कार रिपेयर - पेशेवर कार मेंटेनेंस, इंजन रिपेयर और ऑटोमोबाइल सर्विसिंग। वर्ली, मुंबई।",
  "Murgan Automobile - Professional Car Maintenance, Two-Wheeler & Four-Wheeler Automobile Repair Services. Address: Near Dadar Petrol Pump, Madhavdas Pasta Road, Dadar East, Mumbai-400014, Maharashtra.":
    "मुरुगन ऑटोमोबाइल - टू-व्हीलर और फोर-व्हीलर ऑटोमोबाइल रिपेयर एवं मेंटेनेंस सेवाएं। दादर ईस्ट, मुंबई।",
  "Sai Car Ac Care - Specialized Car AC Repair, Gas Refilling, Heating & Cooling Maintenance. Address: Mcgm Parking, Indiabulls Sky Forest 4 Th Floor Senapati Bapat Marg Saidham Nagar, Prabhadevi, Mumbai-400013, Maharashtra.":
    "साईं कार एसी केयर - कार एसी रिपेयर, गैस रीफिलिंग, हीटिंग और कूलिंग मेंटेनेंस विशेषज्ञ। प्रभादेवी, मुंबई।",
  "Krishna Automobiles - Complete Automobile Repair, General Servicing & Engine Maintenance. Address: 9. Old Money Mahal, Opera House, Mathew Road, Girgaon, Mumbai-400004, Maharashtra.":
    "कृष्णा ऑटोमोबाइल्स - सम्पूर्ण ऑटोमोबाइल रिपेयर, जनरल सर्विसिंग और इंजन मेंटेनेंस। गिरगांव, मुंबई।",
  "S. Malusare Auto Works - Expert Multi-brand Car Repair, Mechanical Diagnostics & Garage Services. Address: Sam Ruston and Co Garage 31/33, Near Hotel A K International, Adi Marzban Path, Fort, Mumbai-400001, Maharashtra.":
    "एस. मालुसरे ऑटो वर्क्स - मल्टी-ब्रांड कार रिपेयर, मैकेनिकल डायग्नोस्टिक्स और गैराज सेवाएं। फोर्ट, मुंबई।",
  "Rishabh Shine Expert - Deep House Cleaning, Floor Polishing, Home Sanitizing & Professional Shine Services. Address: 4th Floor, Room Number 405, Building Name-Ramchandra Ashirwad, Ashale Gaov, Near By VTC Ground Road, Ashele Gaon, Ulhasnagar No 4, Thane-421004, Maharashtra.":
    "ऋषभ शाइन एक्सपर्ट - डीप हाउस क्लीनिंग, फ्लोर पॉलिशिंग, होम सैनिटाइजिंग और पेशेवर सफाई सेवाएं। उल्हासनगर, ठाणे।",
  "Clean X - Professional House Cleaning, Commercial & Residential Sanitizing Services. Address: Shop No 1, CAMA ESTATE, Near Kusum Masala, Walbhat Road, Goregaon East, Mumbai-400063, Maharashtra.":
    "क्लीन एक्स - पेशेवर घर की सफाई, वाणिज्यिक और आवासीय सैनिटाइजिंग सेवाएं। गोरेगांव ईस्ट, मुंबई।"
};

export function getLocalizedBio(description, language = "en", description_hi = "") {
  // If language is Hindi and worker explicitly provided description_hi in database
  if (language === "hi" && description_hi && typeof description_hi === "string" && description_hi.trim() !== "") {
    return description_hi.trim();
  }

  if (!description || typeof description !== "string" || description.trim() === "" || description.trim() === ".") {
    return language === "hi" ? "इस वर्कर ने अभी तक कोई विवरण नहीं लिखा है।" : "No description provided.";
  }

  const trimmed = description.trim();

  // If language is English, return directly
  if (language !== "hi") {
    return trimmed;
  }

  // 1. Direct dictionary match
  if (exactTranslations[trimmed]) {
    return exactTranslations[trimmed];
  }

  // 2. Pattern Matching for "X Years of Experience..."
  const expMatch = trimmed.match(/^(\d+)\s*(?:Years|Year|years|year)\s*of\s*Experience(?:\.|\s*in\s*|\s*,\s*)(.*)$/i);
  if (expMatch) {
    const years = expMatch[1];
    let details = expMatch[2].trim();
    if (details.toLowerCase().startsWith("in ")) {
      details = details.slice(3).trim();
    }
    if (details.toLowerCase().startsWith("specializing in ")) {
      details = details.slice(16).trim();
    }

    // Replace common keywords in details
    const termMap = [
      [/Vedic astrology/gi, "वैदिक ज्योतिष"],
      [/Horoscope analysis/gi, "कुंडली विश्लेषण"],
      [/Horoscope Reading/gi, "कुंडली पठन"],
      [/Horoscope matching/gi, "कुंडली मिलान"],
      [/Kundali Matching/gi, "कुंडली मिलान"],
      [/Kundali Analysis/gi, "कुंडली विश्लेषण"],
      [/matchmaking/gi, "विवाह मिलान"],
      [/personalized spiritual guidance/gi, "व्यक्तिगत आध्यात्मिक मार्गदर्शन"],
      [/Vastu Consultation/gi, "वास्तु परामर्श"],
      [/Vastu Consultancy/gi, "वास्तु परामर्श"],
      [/Vastu Shastra/gi, "वास्तु शास्त्र"],
      [/Vedic Rituals/gi, "वैदिक अनुष्ठान"],
      [/Vedic Puja/gi, "वैदिक पूजा"],
      [/Satyanarayan Katha/gi, "सत्यनारायण कथा"],
      [/Tarot Astrology/gi, "टैरो ज्योतिष"],
      [/Tarot readings/gi, "टैरो रीडिंग"],
      [/Chakra Energy Healing/gi, "चक्र ऊर्जा हीलिंग"],
      [/Space Energy Healing/gi, "स्पेस एनर्जी हीलिंग"],
      [/spiritual healing solutions/gi, "आध्यात्मिक हीलिंग"],
      [/Astrological Guidance/gi, "ज्योतिषीय मार्गदर्शन"],
      [/Astrological remedies/gi, "ज्योतिषीय उपाय"],
      [/Navchandi Yagya/gi, "नवचंडी यज्ञ"],
      [/accurate astrological predictions/gi, "सटीक ज्योतिषीय भविष्यवाणियां"],
      [/Hawan\/Puja rituals/gi, "हवन व पूजा अनुष्ठान"],
      [/leakage fixes/gi, "लीकेज मरम्मत"],
      [/tap installations/gi, "नल फिटिंग"],
      [/drainage repairs/gi, "ड्रेनेज रिपेयर"],
      [/home wiring/gi, "होम वायरिंग"],
      [/appliance setup/gi, "उपकरण स्थापना"],
      [/AC installation and cooling solutions/gi, "एसी इंस्टॉलेशन और कूलिंग समाधान"],
      [/and/gi, "और"]
    ];

    let translatedDetails = details;
    termMap.forEach(([regex, replacement]) => {
      translatedDetails = translatedDetails.replace(regex, replacement);
    });

    return `${years} वर्षों का अनुभव। ${translatedDetails}`;
  }

  // Fallback return trimmed text if no specific translation rule applies
  return trimmed;
}
