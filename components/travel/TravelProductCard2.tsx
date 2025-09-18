// components/travel/TravelProductCard.tsx

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IndianRupee, Clock, MapPin, Utensils, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface TravelProductCardProps {
  productId: string;
  onDelete?: () => void;
}

export default function TravelProductCard({ productId, onDelete }: TravelProductCardProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProductAndRole = async () => {
      const { data: productData } = await supabase
        .from("travel_products")
        .select("*")
        .eq("product_id", productId)
        .single();

      if (productData) setProduct(productData);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role) setRole(profile.role);
      }

      setLoading(false);
    };

    fetchProductAndRole();
  }, [productId]);

  if (loading) return <div className="p-4 bg-gray-100 rounded-2xl animate-pulse h-64"></div>;
  if (!product) return <p className="p-4 bg-red-50 text-red-600 rounded-2xl">Product not found.</p>;

  let categories: any[] = [];
  try {
    categories =
      typeof product.categories === "string"
        ? JSON.parse(product.categories)
        : product.categories || [];
  } catch {
    categories = [];
  }

  const canBook = role === "consumer" || role === "admin";

  const handleBookNow = async () => {
    if (!selectedCategory) {
      alert("Please select a category first!");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("You need to be logged in to book.");

    const bookingEntry = {
      product_id: productId,
      category: selectedCategory.categoryName,
      pricing: selectedCategory.pricing,
      booked_at: new Date().toISOString(),
    };

    const { data: profile } = await supabase
      .from("consumer_profiles")
      .select("booked_travels")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      await supabase.from("consumer_profiles").insert([{ id: user.id, booked_travels: [bookingEntry] }]);
    } else {
      await supabase
        .from("consumer_profiles")
        .update({ booked_travels: [...profile.booked_travels, bookingEntry] })
        .eq("id", user.id);
    }

    alert("Package added to cart successfully!");
    router.push("/TravelCheckout");
    setShowOverlay(false);
  };

return (
  <>
    {/* Main Card */}
    <Card className="relative shadow-lg rounded-3xl overflow-hidden border-0 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-105">
      <CardContent onClick={() => setShowOverlay(true)} className="cursor-pointer p-0">
        <div className="relative">
          <Image
            src={product.thumbnail}
            alt={product.package_name}
            width={400}
            height={250}
            className="w-full h-52 object-cover rounded-t-3xl"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white rounded-b-3xl">
            <h2 className="text-xl font-bold">{product.package_name}</h2>
            <p className="text-sm opacity-90">{product.org_name}</p>
          </div>
          <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium text-black shadow">
            {categories[0]?.days}D/{categories[0]?.nights}N
          </div>
        </div>

        <div className="p-4">
          {categories.length > 0 && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 text-lg font-semibold text-black">
                <IndianRupee size={20} /> {categories[0].pricing.inr}
              </div>
              <div className="flex items-center gap-1 text-sm text-black">
                <Image src="/media/icons/bitcoin.png" alt="BTC" width={16} height={16} /> {categories[0].pricing.btc}
              </div>
              <div className="flex items-center gap-1 text-sm text-black">
                <Image src="/media/icons/ethereum.png" alt="ETH" width={16} height={16} /> {categories[0].pricing.eth}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>

    {/* Overlay */}
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl max-h-[90vh] overflow-y-auto w-full max-w-4xl shadow-2xl relative"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowOverlay(false)}
              className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-black shadow transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header Image */}
            <div className="relative h-64">
              <Image
                src={product.thumbnail}
                alt={product.package_name}
                fill
                className="object-cover rounded-t-3xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white rounded-b-3xl">
                <h2 className="text-3xl font-bold">{product.package_name}</h2>
                <p className="text-lg opacity-90">{product.org_name}</p>
              </div>
            </div>

            {/* Categories & Itinerary */}
            <div className="p-6 space-y-6">
              {categories.map((cat: any) => (
                <motion.div
                  key={cat.categoryName}
                  layout
                  className={`border rounded-2xl p-4 cursor-pointer transition-all ${
                    selectedCategory?.categoryName === cat.categoryName
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory?.categoryName === cat.categoryName}
                      onChange={() => setSelectedCategory(cat)}
                      className="accent-blue-600"
                    />
                    <h3 className="text-xl font-semibold text-black">{cat.categoryName}</h3>
                    <span className="ml-auto text-gray-600 font-medium">{cat.days}D / {cat.nights}N</span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-1 text-lg font-semibold text-black">
                      <IndianRupee size={20} /> {cat.pricing.inr}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-black">
                      <Image src="/media/icons/bitcoin.png" alt="BTC" width={16} height={16} /> {cat.pricing.btc}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-black">
                      <Image src="/media/icons/ethereum.png" alt="ETH" width={16} height={16} /> {cat.pricing.eth}
                    </div>
                  </div>

                  {/* Itinerary */}
                  <div className="space-y-6">
                    {cat.itinerary.map((day: any) => (
                      <div key={day.dayNumber} className="border-l-4 border-blue-500 pl-4 py-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
                        <h4 className="text-lg font-bold text-black mb-4">Day {day.dayNumber}</h4>

                        {/* Food */}
                        <div className="bg-white p-4 rounded-xl shadow-md mb-4">
                          <h5 className="font-semibold text-black mb-3 flex items-center gap-2">
                            <Utensils size={16} /> Meals Included
                          </h5>
                          <div className="flex flex-wrap gap-3">
                            {Object.values(day.food).flatMap((meal: any) =>
                              meal.items.map((item: any) => (
                                <div key={item.name} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg shadow-sm hover:bg-gray-100 transition">
                                  {item.images[0] && (
                                    <Image src={item.images[0]} alt={item.name} width={40} height={40} className="rounded object-cover" />
                                  )}
                                  <span className="text-black font-medium text-sm">{item.name}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Sites */}
                        <div className="bg-white p-4 rounded-xl shadow-md">
                          <h5 className="font-semibold text-black mb-3 flex items-center gap-2">
                            <MapPin size={16} /> Places to Visit
                          </h5>
                          <div className="space-y-3">
                            {day.sites.map((site: any) => (
                              <div key={site.name} className="flex gap-3 bg-gray-50 p-3 rounded-lg shadow-sm hover:bg-gray-100 transition">
                                {site.images[0] && (
                                  <Image src={site.images[0]} alt={site.name} width={60} height={60} className="rounded object-cover flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                  <p className="font-medium text-black">{site.name}</p>
                                  <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                                    <Clock size={14} /> <span>{site.stayHours} hours</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {canBook && (
                <Button
                  onClick={handleBookNow}
                  className="w-full py-3 text-lg mt-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg"
                >
                  Book This Package
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
);
  }