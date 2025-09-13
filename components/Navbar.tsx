"use client";

import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { smoothScrollTo } from "../lib/scroll";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const go = (id: string) => {
    smoothScrollTo(id);
    setIsMobileMenuOpen(false);
  };

  // const scrollToTop = () => smoothScrollTo("top");

  return (
    <nav
      id="site-header" // <-- used for offset calculation
      className="flex justify-between items-center px-6 py-4 backdrop-blur-lg bg-white/20 border-b border-white/20 shadow-lg sticky top-0 z-50"
    >
      {/* Logo - click to scroll to top */}
  <button onClick={() => router.push("/")} className="flex items-center gap-4 focus:outline-none">
        <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-2xl ring-1 ring-white/30 overflow-hidden">
          <img src="/media/flight.png" alt="WB Tour Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
            JH Tour
          </h1>
          <p className="text-sm text-gray-200 font-medium">Explore Jharkhand</p>
        </div>
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6 font-semibold text-gray-200">
        <button onClick={() => router.push("/Culture")} className={pathname === "/#Culture&Events" ? "text-indigo-400" : "hover:text-indigo-400"}>
          Culture&Events
        </button>
        <button onClick={() =>router.push("/auth/login")} className={pathname === "/#Stores" ? "text-indigo-400" : "hover:text-indigo-400"}>
          Login
        </button>
        <button onClick={() => go("contact")} className={pathname === "/#contact" ? "text-indigo-400" : "hover:text-indigo-400"}>
          Contact
        </button>
       <Button
  className="
    relative 
    px-8 py-4 
    text-lg font-semibold 
    text-white 
    rounded-xl 
    bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500
    shadow-lg shadow-indigo-400/40
    overflow-hidden
    transition-all duration-300 ease-out
    group
    hover:scale-105 hover:shadow-indigo-500/50
    active:scale-95
  "
  onClick={() => router.push("/map")}
>
  {/* Shine Effect */}
  <span
    className="
      absolute inset-0 
      bg-gradient-to-r from-white/40 via-transparent to-transparent
      translate-x-[-100%]
      group-hover:translate-x-[100%]
      transition-transform duration-700 ease-in-out
    "
  />

  {/* Button Content */}
  <span className="relative z-10 flex items-center justify-center">
    Explore
    <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
  </span>
</Button>

      </div>

      {/* Mobile Menu Button */}
      <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-200 hover:text-indigo-400 rounded-lg">
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/20 backdrop-blur-lg shadow-xl border-t border-white/20 md:hidden">
          <div className="flex flex-col space-y-4 p-6">
            <button onClick={() => go("destinations")} className="py-3 px-4 rounded-xl hover:bg-indigo-50/50 hover:text-indigo-400">Culture&Events</button>
            <button onClick={() => go("how-it-works")} className="py-3 px-4 rounded-xl hover:bg-indigo-50/50 hover:text-indigo-400">Login</button>
            <button onClick={() => go("contact")} className="py-3 px-4 rounded-xl hover:bg-indigo-50/50 hover:text-indigo-400">Contact</button>
            <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white py-4 rounded-xl" onClick={() => router.push("/map")}>
              Explore<ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
