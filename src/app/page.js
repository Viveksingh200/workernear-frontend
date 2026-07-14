import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PopularServices from "@/components/PopularServices";
import TopProfessionals from "@/components/TopProfessionals";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Find Trusted Local Workers Near You",
  description:
    "Search trusted electricians, plumbers, carpenters, painters, AC repair technicians and home service professionals near your location.",
  alternates: {
    canonical: "https://workernear.com",
  },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <PopularServices />
        <TopProfessionals />
      </main>
      <Footer />
    </div>
  );
}
