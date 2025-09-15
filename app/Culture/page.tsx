"use client";

import { motion } from "framer-motion";
import { Music, Palette, Book, Theater } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import CultureSection from "../../components/culture/CultureSection";
import ArtistShowcase from "../../components/culture/ArtistShowcase";
import TraditionTimeline from "../../components/culture/TraditionTimeline";

export default function Culture() {
  const router = useRouter();

  const culturalAspects = [
    {
      id: "music-dance",
      title: "Music & Dance",
      icon: Music,
      description:
        "Jharkhand’s cultural heart beats with tribal folk songs, rhythmic dances, and traditional instruments like mandar, nagara, and bansuri.",
      image:
        "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&q=80",
      highlights: [
        "Chhau Dance",
        "Karma Dance",
        "Sarhul Songs",
        "Traditional Instruments",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "literature-poetry",
      title: "Oral Traditions & Folklore",
      icon: Book,
      description:
        "Jharkhand is rich in oral traditions passed through generations, with folk tales, myths, and stories reflecting tribal wisdom and social life.",
      image:
        "https://images.unsplash.com/photo-1617196039897-b56e4e1e1c5e?w=600&q=80",
      highlights: [
        "Folk Tales",
        "Tribal Myths",
        "Traditional Proverbs",
        "Storytelling Rituals",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "traditional-arts",
      title: "Traditional Arts & Crafts",
      icon: Palette,
      description:
        "Jharkhand’s artisans are known for their woodcraft, dokra (metal casting), Sohrai & Kohbar paintings, and stone carvings.",
      image:
        "https://images.unsplash.com/photo-1621609772728-7b6c9f25e2ea?w=600&q=80",
      highlights: [
        "Sohrai Painting",
        "Kohbar Art",
        "Dokra Metal Craft",
        "Wood & Bamboo Work",
      ],
      color: "from-orange-500 to-red-500",
    },
    {
      id: "theater-cinema",
      title: "Festivals & Performances",
      icon: Theater,
      description:
        "Jharkhand’s culture thrives in vibrant festivals and performances rooted in tribal life, celebrating nature, harvest, and community.",
      image:
        "https://images.unsplash.com/photo-1508675801634-7d62bba6f43f?w=600&q=80",
      highlights: ["Sarhul Festival", "Karma Festival", "Sohrai Festival", "Chhau Performance"],
      color: "from-green-500 to-teal-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-yellow-900/ to-red-900/90" />
       <div className="absolute inset-0 opacity-70">
  <Image
    src="https://images.unsplash.com/photo-1669040186491-49551a47bdb1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    alt="Jharkhand Culture"
    fill
    className="object-cover"
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
              Culture & <span className="text-yellow-400">Heritage</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
              Immerse yourself in the vibrant cultural heritage of Jharkhand,
              where music, dance, art, and traditions reflect the deep connection
              between people and nature.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  300+
                </div>
                <div className="text-sm opacity-90">Cultural Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  1000+
                </div>
                <div className="text-sm opacity-90">Folk Artists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">20</div>
                <div className="text-sm opacity-90">Tribal Communities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  50+
                </div>
                <div className="text-sm opacity-90">Folk Art Forms</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cultural Aspects */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Cultural <span className="text-purple-600">Treasures</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the diverse cultural expressions that make Jharkhand a
              unique blend of tribal traditions and artistic excellence.
            </p>
          </motion.div>

          <div className="space-y-20">
            {culturalAspects.map((aspect, index) => (
              <CultureSection
                key={aspect.title}
                aspect={aspect}
                index={index}
                isReverse={index % 2 === 1}
              />
            ))}
          </div>
        </div>
      </section>

      <ArtistShowcase />
      <TraditionTimeline />

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-6">Experience Living Culture</h2>
            <p className="text-xl mb-8 opacity-90">
              Join tribal festivals, attend folk performances, and connect with
              local artisans to truly experience Jharkhand’s living culture.
            </p>
            <button
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              onClick={() => router.push("/events")}
            >
              Find Cultural Events
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
