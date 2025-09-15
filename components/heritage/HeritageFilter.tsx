"use client";

import React from "react";
import { Building, Crown, Home, Church } from "lucide-react";

type HeritageFilterProps = {
  activeFilter: string;
  setActiveFilter: (id: string) => void;
};

export default function HeritageFilter({
  activeFilter,
  setActiveFilter,
}: HeritageFilterProps) {
  const filters = [
    { id: "all", label: "All Sites", icon: Building, count: 50 },
    { id: "monument", label: "Monuments", icon: Building, count: 15 },
    { id: "temple", label: "Temples", icon: Church, count: 20 },
    { id: "palace", label: "Palaces", icon: Crown, count: 8 },
    { id: "architecture", label: "Architecture", icon: Home, count: 7 },
  ];

  return (
    <div className="mb-12">
      <div className="flex flex-wrap justify-center gap-4">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 transform ${
              activeFilter === filter.id
                ? "bg-gradient-to-r from-[#FF7F50] via-[#FFB347] to-[#8B4513] text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-[#FFE4C4] hover:text-[#8B4513] shadow-md"
            }`}
          >
            <filter.icon
              className={`w-5 h-5 ${
                activeFilter === filter.id ? "text-white" : "text-gray-600"
              }`}
            />
            <span className="tracking-wide">{filter.label}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                activeFilter === filter.id
                  ? "bg-white/20 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {filter.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
