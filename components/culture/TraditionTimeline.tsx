"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Star, Heart } from "lucide-react";

export default function TraditionTimeline() {
  const traditions = [
    {
      period: "Ancient Era",
      year: "Before 1000 CE",
      title: "Tribal Traditions Take Root",
      description:
        "Jharkhand’s cultural foundation was built by its tribal communities such as Santhal, Munda, Oraon, and Ho. Folk music, dance, and rituals tied to nature and harvest festivals shaped their way of life. Instruments like Mandar and Bansuri were integral to village gatherings.",
      icon: Users,
      color: "from-amber-500 to-orange-500",
    },
    {
      period: "Medieval Period",
      year: "1200–1700 CE",
      title: "Festivals and Folk Arts Flourish",
      description:
        "Tribal festivals like Sarhul, Karma, and Sohrai became central to community identity, celebrating fertility, nature, and harvest. Distinctive wall paintings, body art, and woodcraft evolved as markers of cultural expression.",
      icon: Star,
      color: "from-blue-500 to-purple-500",
    },
    {
      period: "Colonial Era",
      year: "1700–1947 CE",
      title: "Resistance and Cultural Identity",
      description:
        "Despite colonial influence, tribal groups preserved their unique dances, songs, and crafts. The Chhau dance gained prominence, while resistance movements like Birsa Munda’s Ulgulan also carried cultural significance, strengthening unity and heritage pride.",
      icon: Heart,
      color: "from-green-500 to-teal-500",
    },
    {
      period: "Modern Era",
      year: "1947–Present",
      title: "Statehood and Cultural Recognition",
      description:
        "After Jharkhand was formed in 2000, its tribal arts, music, and festivals gained recognition across India and globally. Tribal handicrafts, Chhau dance, and folk traditions are now celebrated as a vital part of India’s cultural mosaic.",
      icon: Calendar,
      color: "from-red-500 to-pink-500",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Cultural <span className="text-purple-600">Timeline</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Journey through the evolution of Jharkhand’s rich cultural heritage
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Desktop Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-purple-500 to-blue-500 hidden md:block" />

          {/* Mobile Vertical Line (left side) */}
          <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-purple-500 to-blue-500 md:hidden" />

          <div className="space-y-12">
            {traditions.map((tradition, index) => (
              <motion.div
                key={tradition.period}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`flex md:items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div
                  className={`w-full md:w-5/12 ${
                    index % 2 === 0 ? "md:text-right" : ""
                  }`}
                >
                  <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    {/* Mobile Timeline Node */}
                    <div className="absolute -left-7 top-6 w-5 h-5 bg-gradient-to-r md:hidden rounded-full border-4 border-white shadow-lg" />

                    <div
                      className={`inline-flex w-12 h-12 bg-gradient-to-r ${tradition.color} rounded-full items-center justify-center mb-4`}
                    >
                      <tradition.icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="text-sm font-semibold text-gray-500 mb-1">
                      {tradition.year}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {tradition.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {tradition.description}
                    </p>
                  </div>
                </div>

                {/* Timeline Node (Desktop Center) */}
                <div className="hidden md:flex w-2/12 justify-center">
                  <div
                    className={`w-6 h-6 bg-gradient-to-r ${tradition.color} rounded-full border-4 border-white shadow-lg`}
                  />
                </div>

                {/* Right empty column only for desktop */}
                <div className="hidden md:block md:w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
