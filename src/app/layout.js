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
  title: "Workers - Find local pros for any project",
  description: "Trusted professionals in your community, ready to help.",
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

