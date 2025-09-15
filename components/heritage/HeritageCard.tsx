"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Clock, Star, Heart, Calendar, DollarSign } from "lucide-react";

type HeritageCardProps = {
  site: {
    id: number;
    name: string;
    location: string;
    category: string;
    image: string;
    description: string;
    established: string;
    visitDuration: string;
    rating: number;
    highlights: string[];
    bestTime: string;
    entryFee: string;
  };
  index: number;
};

export default function HeritageCard({ site }: HeritageCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden">
        <Image
          src={site.image}
          alt={site.name}
          width={600}
          height={400}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-gradient-to-r from-[#D2691E] to-[#FFB347] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-md">
            {site.category}
          </span>
        </div>

        {/* Like button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/50 transition-all shadow-md"
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isLiked ? "text-red-500 fill-current" : "text-white"
            }`}
          />
        </button>

        {/* Rating badge */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center shadow-md">
          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
          <span className="text-sm font-semibold text-gray-800">{site.rating}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1.5" />
          {site.location}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#D2691E] transition-colors">
          {site.name}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
          {site.description}
        </p>

        {/* Established + Duration */}
        <div className="flex justify-between items-center text-xs text-gray-500 mb-4 pt-3 border-t border-gray-200">
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            Est. {site.established}
          </div>
          <div className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {site.visitDuration}
          </div>
        </div>

        {/* Toggle button */}
        <div className="mt-auto">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-center bg-[#FFB347]/20 text-[#D2691E] py-2.5 px-4 rounded-xl hover:bg-[#FFB347]/40 transition-all font-semibold text-sm shadow-sm"
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </button>
        </div>

        {/* Expandable Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200 transition-all duration-500">
            <div className="space-y-3">
              <div className="flex items-start text-sm">
                <DollarSign className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-700">Entry Fee</div>
                  <div className="text-xs text-gray-500">{site.entryFee}</div>
                </div>
              </div>

              <div className="flex items-start text-sm">
                <Clock className="w-4 h-4 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-700">Best Time to Visit</div>
                  <div className="text-xs text-gray-500">{site.bestTime}</div>
                </div>
              </div>

              <div>
                <div className="font-semibold text-sm mb-2 text-gray-700">Highlights</div>
                <div className="flex flex-wrap gap-2">
                  {site.highlights.map((highlight, idx) => (
                    <span
                      key={idx}
                      className="bg-[#FFF0E0] text-[#D2691E] px-2 py-1 rounded-lg text-xs shadow-sm"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
