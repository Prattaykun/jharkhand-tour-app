"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  Users,
  Globe,
  Award,
  MapPin,
  Calendar,
  Camera,
} from "lucide-react";

export default function AboutPage() {
  const stats = [
    { icon: MapPin, label: "Districts Covered", value: "24", color: "text-green-600" },
    { icon: Users, label: "Annual Visitors", value: "20M+", color: "text-orange-600" },
    { icon: Calendar, label: "Heritage Sites", value: "120+", color: "text-red-600" },
    { icon: Camera, label: "Cultural Festivals", value: "600+", color: "text-yellow-600" },
  ];

  const team = [
    {
      name: "Tribal Affairs Division",
      role: "Cultural Preservation",
      description: "Protecting and promoting Jharkhand’s tribal heritage, art, and traditions.",
      icon: Heart,
    },
    {
      name: "Tourism Development",
      role: "Eco & Adventure Tourism",
      description: "Promoting waterfalls, forests, and heritage circuits for travelers worldwide.",
      icon: Globe,
    },
    {
      name: "Community Engagement",
      role: "Local Partnerships",
      description: "Working with tribal communities to showcase authentic Jharkhandi culture.",
      icon: Users,
    },
    {
      name: "Digital Innovation",
      role: "Virtual Experiences",
      description: "Using AR/VR & modern tech to make Jharkhand’s culture accessible globally.",
      icon: Award,
    },
  ];

  const milestones = [
  { 
    year: "2019", 
    title: "Jharkhand Tourism Revamp", 
    description: "Focused on eco-tourism, tribal art promotion, and sustainable travel initiatives, laying the foundation for Jharkhand as a vibrant and responsible tourism destination." 
  },
  { 
    year: "2020", 
    title: "Heritage Mapping", 
    description: "Documented over 120 heritage and tribal sites, including festivals like Sarhul and Karma, while preserving oral traditions, folk songs, and indigenous craftsmanship." 
  },
  { 
    year: "2021", 
    title: "Community Partnership", 
    description: "Collaborated with Santhal, Munda, and Oraon tribes to promote folk dances, crafts, and traditions, creating livelihood opportunities and strengthening cultural pride." 
  },
  { 
    year: "2022", 
    title: "Eco & Adventure Tourism", 
    description: "Launched eco-trails, trekking routes, and waterfall circuits across 24 districts, attracting nature enthusiasts and adventure travelers from across the country." 
  },
  { 
    year: "2023", 
    title: "Global Recognition", 
    description: "Recognized internationally for promoting tribal festivals, handicrafts, and eco-tourism, positioning Jharkhand as a unique cultural and ecological destination on the world map." 
  },
];


  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-orange-50">
    {/* Hero Section */}
<section className="relative py-30 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-yellow-900/80" />
  <div className="absolute inset-0">
    <Image
      src="https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="About Jharkhand Tour"
      fill
      className="object-cover opacity-70"
      priority
    />
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-5xl md:text-7xl font-bold mb-6">
        About <span className="text-yellow-400">Jharkhand Tour</span>
      </h1>
      <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
        Discover the tribal heartland of India. From lush forests and breathtaking waterfalls 
        to vibrant festivals and cultural traditions, Jharkhand offers an experience like no other.
      </p>
    </motion.div>
  </div>

  {/* Scroll Icon */}
  {/* Scroll Mouse Icon */}
<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
  <motion.div
    animate={{ y: [0, 10, 0] }}
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
    <span className="mt-3 text-sm uppercase tracking-widest">Scroll</span>
  </motion.div>
</div>

</section>


       {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-green-700">Mission</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
  Our mission is to safeguard and celebrate the diverse cultural and natural wealth of Jharkhand — 
  from its vibrant tribal traditions and sacred festivals to its lush forests, majestic waterfalls, 
  and abundant wildlife. We are committed to creating sustainable opportunities that empower local 
  communities, ensuring that development goes hand-in-hand with preservation. At the same time, we 
  warmly invite the world to experience Jharkhand’s beauty, stories, and spirit, fostering meaningful 
  connections between people, nature, and heritage.
</p>

          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center p-8 bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cultural Preservation</h3>
              <p className="text-gray-600 leading-relaxed">
                Promoting tribal art, music, and traditions to safeguard Jharkhand’s cultural identity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center p-8 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community Empowerment</h3>
              <p className="text-gray-600 leading-relaxed">
                Supporting local communities and artisans through tourism, cultural events, and fair trade.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center p-8 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Outreach</h3>
              <p className="text-gray-600 leading-relaxed">
                Showcasing Jharkhand’s treasures to the world, blending tradition with modern digital storytelling.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

    {/* Stats Section */}
<section className="relative py-20 bg-gray-900 text-white overflow-hidden">
  {/* Custom Tribal Motif Background */}
  <div
    className="absolute inset-0 opacity-15"
    style={{
      backgroundImage: `
        linear-gradient(45deg, rgba(250,204,21,0.3) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(34,197,94,0.3) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, rgba(250,204,21,0.3) 75%),
        linear-gradient(-45deg, transparent 75%, rgba(34,197,94,0.3) 75%)
      `,
      backgroundSize: "60px 60px",
    }}
  />
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1757009400493-509e7b48c95d?q=80&w=2055&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: 0.20, // 👈 watermark-like effect
    }}
  />

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-6">
        Our <span className="text-yellow-400">Impact</span>
      </h2>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto">
        Celebrating Jharkhand’s heritage through eco-tourism, tribal festivals, and cultural preservation.
      </p>
    </motion.div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
          </div>
          <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
          <div className="text-gray-300 font-medium">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-green-700">Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate teams working with local communities to preserve and share Jharkhand’s story.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-yellow-600 rounded-2xl flex items-center justify-center mb-4">
                  <member.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{member.name}</h3>
                <div className="text-sm text-green-700 font-medium mb-3">{member.role}</div>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-green-700">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Milestones in Jharkhand’s tourism and cultural preservation.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-green-600 to-yellow-600" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                    <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl p-6 shadow-lg relative z-10">
                      <div className="text-2xl font-bold text-green-700 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>

                  <div className="flex w-full md:w-2/12 justify-center my-4 md:my-0 z-20">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-600 to-yellow-600 rounded-full border-4 border-white shadow-lg" />
                  </div>

                  <div className="hidden md:block w-full md:w-5/12" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-700 to-yellow-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl mb-8 opacity-90">
              Be part of Jharkhand’s journey to preserve tribal culture, promote eco-tourism, 
              and celebrate the land of forests, waterfalls, and festivals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
                Get Involved
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-green-700 transition-all transform hover:scale-105">
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
