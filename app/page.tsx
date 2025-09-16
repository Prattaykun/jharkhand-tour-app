"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Camera, Heart, ArrowRight, Users, X, Search as SearchIcon } from "lucide-react";
import Search from "@/components/Search";
import HeroSection from "../components/home/HeroSection";
import FeaturedDestinations from "../components/home/FeaturedDestinations";
import CulturalHighlights from "../components/home/CulturalHighlights";
import TestimonialSection from "../components/home/TestimonialSection";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import Menu from "@/components/Menu";
import Chatbot from "@/components/Chatbot";
import { motion } from "framer-motion";

// Define the SearchResult interface for the home page
interface SearchResult {
  id: string;
  type: 'place' | 'hotel' | 'event' | 'artisan' | 'product';
  name: string;
  image: string | null;
  rating?: number;
  location?: string;
  description?: string;
  [key: string]: any;
}

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);
  const router = useRouter();

  const heroImages = [
    "/media/photo-1619500765355-8ba767d6e261.jpeg",
    "/media/ 2.avif",
    "/media/ET77GGKVAAEZJxu.jpeg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const stats = [
    { icon: MapPin, label: "Heritage Sites", value: "50+" },
    { icon: Camera, label: "Photo Spots", value: "200+" },
    { icon: Heart, label: "Cultural Events", value: "100+" },
    { icon: Users, label: "Happy Visitors", value: "10K+" },
  ];

  const handleSearchResultSelect = (result: SearchResult) => {
    // Handle the search result selection
    console.log('Selected result:', result);
    
    // Navigate to the appropriate page based on the result type
    switch (result.type) {
      case 'place':
        router.push(`/places/${result.id}`);
        break;
      case 'hotel':
        router.push(`/hotels/${result.id}`);
        break;
      case 'event':
        router.push(`/events/${result.id}`);
        break;
      case 'artisan':
        router.push(`/artisans/${result.id}`);
        break;
      case 'product':
        router.push(`/products/${result.id}`);
        break;
      default:
        // For suggestions, navigate to a search results page
        router.push(`/search?q=${encodeURIComponent(result.name)}`);
    }
  };

  return (
    <>
      {/* Main Content */}
      <Menu />
      <HeroSection heroImages={heroImages} currentImageIndex={currentImageIndex} />

      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-3xl mx-auto px-20">
            {/* Scroll Mouse Icon */}
<div className="absolute bottom-130 left-1/2 transform -translate-x-1/2 z-20">

  <motion.div
    animate={{ y: [0, 20, 0] }}
    transition={{ repeat: Infinity, duration: 2 }}
    className="flex flex-col items-center text-white opacity-80 hover:opacity-100 cursor-pointer"
  >
    {/* Modern Mouse Shape */}
    <div className="w-10 h-16 border-4 border-white rounded-full flex items-start justify-center p-3 shadow-lg">
      {/* Animated Scroll Wheel */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="w-2 h-3 bg-white rounded-full"
      />
    </div>
    <span className="mt-3 text-sm uppercase  tracking-widest">Scroll</span>
  </motion.div>
</div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8 drop-shadow-sm">
            Find Your Perfect Experience
          </h2>
          

          <Search 
            placeholder="🔍Discover places, hotels, events and more..."
            onResultSelect={handleSearchResultSelect}
            className="max-w-2xl mx-auto my-8 text-black"
          />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid grid-cols-4 gap-10">
  {stats.map((stat) => (
    <div
      key={stat.label}
      className="text-center p-6 rounded-3xl shadow-xl bg-white border border-gray-100"
    >
      <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md">
        <stat.icon className="w-10 h-10 text-white" />
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
      <div className="text-gray-700 font-medium tracking-wide">{stat.label}</div>
    </div>
  ))}
</div>

        </div>
      </section>

      <FeaturedDestinations />
      <CulturalHighlights />
      

     <section className="py-20 bg-gradient-to-r from-green-100 to-emerald-200 relative overflow-hidden">
  {/* Subtle tribal pattern overlay */}
  <div className="absolute inset-0 opacity-10 bg-[url('https://pbs.twimg.com/media/ET77GGKVAAEZJxu?format=jpg&name=4096x4096')] bg-repeat"></div>

  <div className="relative max-w-4xl mx-auto px-4 text-center">
    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-green-900 tracking-tight">
      Ready to Explore Jharkhand?
    </h2>
    <p className="text-lg md:text-xl mb-10 text-green-800 leading-relaxed">
      Journey through sacred forests, tribal traditions, and timeless heritage that define Jharkhand.
    </p>

    <div className="flex flex-col sm:flex-row gap-5 justify-center">
      <Link
        href="/MyTourPlan"
        className="px-8 py-4 rounded-full font-semibold bg-green-600 text-white shadow-md hover:bg-green-700 transition-all transform hover:scale-105 inline-flex items-center justify-center"
      >
        Plan Your Journey <ArrowRight className="w-5 h-5 ml-2" />
      </Link>

      <Link
        href="/Heritage"
        className="px-8 py-4 rounded-full font-semibold border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white transition-all transform hover:scale-105 inline-flex items-center justify-center"
      >
        Explore Heritage Sites <ArrowRight className="w-5 h-5 ml-2" />
      </Link>
    </div>
  </div>
</section>


      <TestimonialSection />

     {/* Floating Action Button & Chatbot */}
<div className="fixed bottom-24 right-6 z-40 flex flex-col items-end">
  {!showChatbot ? (
    <button
      className="w-14 h-14 bg-gradient-to-r from-green-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all duration-300"
      onClick={() => setShowChatbot(true)}
    >
      <SearchIcon className="w-6 h-6" />
    </button>
  ) : (
    <>
      <div className="mb-2">
        <Chatbot />
      </div>
      <button
  className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full shadow-xl flex items-center justify-center text-white hover:shadow-2xl transition-all duration-300 mr-12"
  onClick={() => setShowChatbot(false)}
>
  <X className="w-5 h-5" />
</button>

    </>
  )}
</div>

    </>
  );
}