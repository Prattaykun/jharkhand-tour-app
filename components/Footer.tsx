"use client";

import { Phone, Mail } from "lucide-react";
import { smoothScrollTo } from "@/lib/scroll";

export default function Footer() {
  const go = (id: string) => smoothScrollTo(id);

  return (
    <footer
      id="contact"
      className="bg-gradient-to-br from-gray-950 via-teal-950 to-cyan-900 text-white py-16 relative overflow-hidden max-sm:hidden"
    >
      {/* Subtle background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.1),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo + Description (click to top) */}
          <div className="text-center md:text-left">
            <button
              onClick={() => go("top")}
              className="flex items-center justify-center md:justify-start gap-4 mb-6 focus:outline-none group"
            >
              <div className="w-12 h-12 bg-gradient-to-tr from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/media/flight.png"
                  alt="JH Tour Logo"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <h3 className="text-3xl font-black group-hover:text-teal-300 transition">
                  JH Tour
                </h3>
                <p className="text-teal-300 text-sm font-medium">
                  Explore Jharkhand
                </p>
              </div>
            </button>
            <p className="text-gray-400 leading-relaxed max-w-sm mx-auto md:mx-0">
              Discover the untouched beauty, traditions, and heritage of
              Jharkhand with local insights and authentic experiences.
            </p>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <h4 className="text-xl font-bold mb-4 text-teal-300 tracking-wide">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3 hover:text-teal-300 transition">
                <Phone className="w-5 h-5" />
                <span className="font-medium">+91 99836 11110</span>
              </div>
              <div className="flex items-center justify-center gap-3 hover:text-teal-300 transition">
                <Mail className="w-5 h-5" />
                <span className="font-medium">JHtour@travel.co.pvt</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-right">
            <h4 className="text-xl font-bold mb-4 text-teal-300 tracking-wide">
              Quick Links
              
            </h4>

            <div className="flex flex-col items-center md:items-end space-y-3">
              {[
                { id: "destinations", label: "Destinations" },
                { id: "how-it-works", label: "How It Works" },
                { id: "contact", label: "Contact" },
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => go(link.id)}
                  className="relative group text-gray-300 font-medium transition-all duration-300"
                >
                  {/* Hover underline */}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
                  <span className="group-hover:text-teal-300">
                    {link.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 text-center text-gray-400 text-sm">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-teal-300 font-semibold">JH Tour</span> | by DGPRC.pvt
          </p>
        </div>
      </div>
    </footer>
  );
}
