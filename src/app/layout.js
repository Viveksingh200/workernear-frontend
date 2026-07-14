import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/context/languageContext";
import { AuthProvider } from "@/context/authContext";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://workernear.com"),
  title: {
    default: "WorkerNear - Find Trusted Local Workers Near You",
    template: "%s | WorkerNear",
  },
  description:
    "Find trusted local workers near you including electricians, plumbers, carpenters, painters, AC repair technicians, home cleaning professionals, and more across India.",
  keywords: [
    "worker near me",
    "local workers",
    "plumber near me",
    "electrician near me",
    "AC repair",
    "carpenter near me",
    "home services",
    "find workers",
    "workernear",
    "local service provider",
    "India workers",
  ],
  authors: [
    {
      name: "WorkerNear",
    },
  ],
  creator: "WorkerNear",
  publisher: "WorkerNear",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "WorkerNear - Find Trusted Local Workers Near You",
    description:
      "Search verified local workers by profession and location. View ratings, reviews and contact workers directly.",
    url: "https://workernear.com",
    siteName: "WorkerNear",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "WorkerNear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WorkerNear",
    description: "Find trusted local workers across India.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextTopLoader
          color="#f59e0b"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #f59e0b,0 0 5px #f59e0b"
        />
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

