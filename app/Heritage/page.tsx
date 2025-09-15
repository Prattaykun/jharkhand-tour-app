"use client";

import React, { useState } from "react";
import { MapPin, Clock, Star, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

import HeritageCard from "../../components/heritage/HeritageCard";
import HeritageFilter from "../../components/heritage/HeritageFilter";

export default function Heritage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const router = useRouter();

  const heritageSites = [
    {
      id: 1,
      name: "Jagannath Temple",
      location: "Ranchi",
      category: "temple",
      image:
        "https://images.unsplash.com/photo-1601758123927-8f54f5c1b6c8?w=600&q=80",
      description:
        "Famous Hindu temple dedicated to Lord Jagannath, a spiritual landmark in Ranchi.",
      established: "1691",
      visitDuration: "1-2 hours",
      rating: 4.7,
      highlights: ["Main Temple", "Festivals", "Rituals", "Architecture"],
      bestTime: "October to March",
      entryFee: "Free",
    },
    {
      id: 2,
      name: "Betla National Park",
      location: "Palamu",
      category: "nature",
      image:
        "https://images.unsplash.com/photo-1587620931278-4c0e4f9932a7?w=600&q=80",
      description:
        "One of the first national parks in India, famous for wildlife and scenic beauty.",
      established: "1974",
      visitDuration: "3-5 hours",
      rating: 4.8,
      highlights: ["Wildlife Safari", "Bird Watching", "Nature Trails"],
      bestTime: "November to February",
      entryFee: "₹50 for Indians, ₹500 for Foreigners",
    },
    {
      id: 3,
      name: "Ranchi Hill",
      location: "Ranchi",
      category: "architecture",
      image:
        "https://images.unsplash.com/photo-1596790922303-c0c5a34f567f?w=600&q=80",
      description:
        "Scenic hill offering panoramic views of Ranchi city, a popular tourist spot.",
      established: "Ancient",
      visitDuration: "1 hour",
      rating: 4.6,
      highlights: ["Viewpoint", "Photography", "Sunset Spot"],
      bestTime: "Evening",
      entryFee: "Free",
    },
    {
      id: 4,
      name: "Tagore Hill",
      location: "Ranchi",
      category: "historical",
      image:
        "https://images.unsplash.com/photo-1566802892344-89e1b35a2de0?w=600&q=80",
      description:
        "Historical site associated with Nobel laureate Rabindranath Tagore's family.",
      established: "1900s",
      visitDuration: "1-2 hours",
      rating: 4.7,
      highlights: ["Historical Significance", "Scenic Views", "Picnic Spot"],
      bestTime: "Morning or Evening",
      entryFee: "Free",
    },
    {
      id: 5,
      name: "Jadugoda Uranium Mines",
      location: "East Singhbhum",
      category: "industrial",
      image:
        "https://images.unsplash.com/photo-1577529118254-f2f1b2c31d3d?w=600&q=80",
      description:
        "Famous for uranium mining, showcasing Jharkhand’s industrial heritage.",
      established: "1967",
      visitDuration: "1-2 hours",
      rating: 4.5,
      highlights: ["Mining Tours", "Industrial Visits", "Photography"],
      bestTime: "Morning",
      entryFee: "Restricted",
    },
  ];

  const filteredSites =
    activeFilter === "all"
      ? heritageSites
      : heritageSites.filter((site) => site.category === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Heritage <span className="text-[#D2691E]">Sites of Jharkhand</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-8">
            Discover Jharkhand&apos;s rich heritage, from ancient temples and scenic hills to national parks and historical landmarks.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 bg-white rounded-2xl p-6 shadow-lg max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D2691E] mb-1">30+</div>
              <div className="text-gray-600 font-medium">Heritage Sites</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D2691E] mb-1">500+</div>
              <div className="text-gray-600 font-medium">Years of History</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D2691E] mb-1">5</div>
              <div className="text-gray-600 font-medium">National Parks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D2691E] mb-1">15+</div>
              <div className="text-gray-600 font-medium">Architectural Styles</div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <HeritageFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {/* Heritage Sites Grid */}
        <div className="grid grid-cols-3 gap-8">
          {filteredSites.map((site, index) => (
            <HeritageCard key={site.id} site={site} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 bg-gradient-to-r from-[#FF7F50] via-[#FFB347] to-[#D2691E] rounded-3xl p-8 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-4">
            Plan Your Heritage Journey
          </h2>
          <p className="text-lg mb-6">
            Let us help you create an unforgettable experience exploring Jharkhand&apos;s heritage.
          </p>
          
          <button
            className="bg-white text-[#D2691E] px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            onClick={() => router.push("/MyTourPlan")}
          >
            Get Personalized Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}
