//app/components/home/CulturalHighlights.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Music, Palette, Theater, Trees } from "lucide-react";

export default function JharkhandCulture() {
  const highlights = [
    {
      icon: Music,
      title: "Rhythms of the Land",
      description:
        "Mandar and Nagara drums set the beat for Sarhul and Karma festivals, while dances like Jhumar celebrate life. Music here is both tradition and prayer.",
      color: "from-green-400 to-emerald-600",
    },
    {
      icon: Palette,
      title: "Art of the Soil",
      description:
        "Sohrai and Kohbar wall paintings, bamboo crafts, and tribal metalwork reflect harmony with nature. Each piece carries deep cultural meaning.",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: Theater,
      title: "Festivals of Unity",
      description:
        "Sarhul, Karma, Sohrai, and Tusu bring communities together through song, dance, and ritual, celebrating the bond with forests and fields.",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Trees,
      title: "Living Heritage",
      description:
        "Oral folklore, sacred groves, and Nagpuri songs keep tribal wisdom alive. Culture here flows through everyday life and nature.",
      color: "from-blue-500 to-indigo-600",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative py-24 bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden"
    >
      {/* Tribal pattern background */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.alightindia.com/cdn/uploads/postimages/ORIGINAL/jh10--5aee84.jpg')] bg-repeat"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
            Jharkhand&apos;s Cultural Soul
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Jharkhand’s culture blends tribal music, art, and festivals. Every
            song, dance, and painting reflects harmony with forests and rivers.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 * index }}
              className="relative rounded-3xl p-8 backdrop-blur-md bg-white/5 border border-gray-700 hover:border-orange-400 shadow-lg hover:shadow-orange-500/20 transition-all duration-500 hover:-translate-y-2 group"
            >
              <div
                className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}
              >
                <item.icon className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-orange-400 group-hover:text-yellow-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-300 group-hover:text-gray-100 leading-relaxed text-justify text-sm md:text-base">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

       {/* Tribal Wisdom Section */}
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.9, ease: "easeOut" }}
  className="mt-24 p-10 rounded-3xl relative overflow-hidden bg-gradient-to-br from-green-900/50 via-emerald-800/40 to-yellow-700/30 border border-emerald-600/40 shadow-2xl text-center"
>
  {/* Subtle tribal motif background */}
  <div className="absolute inset-0 opacity-10 bg-[url('https://pbs.twimg.com/media/ET77GGKVAAEZJxu?format=jpg&name=4096x4096')] bg-repeat"></div>

  <h3 className="text-3xl md:text-4xl font-extrabold mb-6 text-yellow-300 tracking-wide drop-shadow-md">
    Tribal Wisdom of Jharkhand
  </h3>

  <blockquote className="italic text-xl md:text-2xl text-gray-100 leading-relaxed max-w-4xl mx-auto relative z-10">
    &quot;The forest is our mother, the river is our life, and the festivals are our heartbeat.&quot;
  </blockquote>

  <p className="mt-6 text-gray-300 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
    For Jharkhand’s tribal communities, wisdom flows through nature itself. 
    Every tree, river, and festival is seen as a living guide — teaching harmony, resilience, and gratitude. 
    Folklore, songs, and rituals preserve this knowledge, passing it down generations as an unwritten philosophy of life.
  </p>

  <div className="mt-6 text-green-300 font-semibold">
    — Oral tradition of the Oraon and Munda communities
  </div>
</motion.div>

      </div>
    </motion.section>
  );
}
