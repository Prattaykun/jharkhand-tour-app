"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Amit Sharma",
      location: "New Delhi, India",
      rating: 5,
      text: "Jharkhand’s natural beauty is beyond words! The waterfalls and forests made my trip a peaceful escape from city life.",
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&q=80",
    },
    {
      name: "Emily Carter",
      location: "New York, USA",
      rating: 5,
      text: "Visiting Ranchi and Netarhat was magical! The hills, fresh air, and tribal culture gave me a once-in-a-lifetime experience.",
      image:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&q=80",
    },
    {
      name: "Ravi Patel",
      location: "Ahmedabad, India",
      rating: 5,
      text: "I loved the vibrant culture of Jharkhand. The tribal art, local cuisine, and serene lakes truly reflect the state’s charm.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What <span className="text-green-600">Visitors Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from travelers who have experienced the beauty, culture, and
            natural wonders of Jharkhand
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Quote */}
              <div className="relative mb-6">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-green-200" />
                <p className="text-gray-700 leading-relaxed pl-6">
                  &quot;{testimonial.text}&quot;
                </p>
              </div>

              {/* Person */}
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
