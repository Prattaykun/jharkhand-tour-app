"use client";

import { Award, Music, Palette, Theater } from "lucide-react";

export default function ArtistShowcase() {
  const artists = [
    {
      name: "Ram Dayal Munda",
      category: "Tribal Music & Literature",
      achievement: "Padma Shri Recipient",
      icon: Music,
      image:
        "/media/540524_1483005971.jpg",
      description:
        "Renowned tribal scholar and musician who promoted Santhali language and folk music.",
    },
    {
      name: "Jharkhandi Folk Dancers",
      category: "Performing Arts",
      achievement: "Preserving Tribal Traditions",
      icon: Theater,
      image:
        "https://upload.wikimedia.org/wikipedia/commons/a/a5/Bihar_Folk_Dance_Jhumar.jpg",
      description:
        "Folk dancers from Munda, Santhal, and Oraon communities showcasing traditional tribal dances like Chhau and Paika.",
    },
    {
      name: "Sukumar Mahato",
      category: "Visual Arts",
      achievement: "Award-winning Tribal Artist",
      icon: Palette,
      image:
        "/media/icons/toilet.png",
      description:
        "Folk and mural artist known for depicting Jharkhand’s tribal life and cultural motifs.",
    },
    {
      name: "Pandit Rajendra Prasad Singh",
      category: "Classical Music",
      achievement: "Sangeet Natak Akademi Recognition",
      icon: Music,
      image:
        "/media/DrRajendraPrasadSingh.jpg",
      description:
        "Classical musician from Jharkhand integrating local folk melodies into classical compositions.",
    },
  ];

  return (
    <section className="py-20 bg-[#F0FFF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2F4F2F] mb-6">
            Legendary <span className="text-[#3CB371]">Artists of Jharkhand</span>
          </h2>
          <p className="text-xl text-[#556B2F] max-w-3xl mx-auto">
            Explore the lives and works of iconic Jharkhandi artists, tribal musicians,
            dancers, and painters who have preserved and enriched the state's culture.
          </p>
        </div>

        {/* Artist Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {artists.map((artist) => (
            <div
              key={artist.name}
              className="group bg-[#E6FFE6] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image + Icon */}
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#3CB371]">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#3CB371] rounded-full flex items-center justify-center">
                  <artist.icon className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-[#2F4F2F] mb-2">
                  {artist.name}
                </h3>

                <div className="bg-[#C1FFC1] text-[#2E8B57] px-3 py-1 rounded-full text-sm font-medium mb-3">
                  {artist.category}
                </div>

                <div className="flex items-center justify-center text-[#66CDAA] text-sm font-semibold mb-3">
                  <Award className="w-4 h-4 mr-1" />
                  {artist.achievement}
                </div>

                <p className="text-[#556B2F] text-sm leading-relaxed">
                  {artist.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
