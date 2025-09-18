"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import TravelProductCard1 from "@/components/travel/TravelProductCard1";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function TravelCheckout() {
  const [cart, setCart] = useState<any[]>([]);
  const [booked, setBooked] = useState<any[]>([]);
  const [currency, setCurrency] = useState<"inr" | "btc" | "eth">("inr");
  const [loading, setLoading] = useState(true);
  const [showBooked, setShowBooked] = useState(false);
  const router = useRouter();

  const [expandedBooked, setExpandedBooked] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("consumer_profiles")
        .select("booked_travels")
        .eq("id", user.id)
        .single();

      if (!error && data?.booked_travels) {
        const allTravels = data.booked_travels;
        setCart(allTravels.filter((item: any) => !item.payment_status));
        setBooked(allTravels.filter((item: any) => item.payment_status === "complete"));
      }
      setLoading(false);
    };

    fetchCart();
  }, []);

  const handleRemove = async (product_id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updated = cart.filter((item) => item.product_id !== product_id);
    setCart(updated);

    await supabase
      .from("consumer_profiles")
      .update({ booked_travels: [...updated, ...booked] })
      .eq("id", user.id);
  };

  const handleAddTrip = () => router.push("/PlanTrip");

  const handleCheckout = () => {
    if (currency === "inr") router.push("/payment/razorpay");
    else router.push(`/payment/crypto?currency=${currency}`);
  };

  const totals = cart.reduce(
    (acc, item) => {
      acc.inr += Number(item.pricing?.inr || 0);
      acc.btc += Number(item.pricing?.btc || 0);
      acc.eth += Number(item.pricing?.eth || 0);
      return acc;
    },
    { inr: 0, btc: 0, eth: 0 }
  );

  if (loading) return <p className="p-6 text-center text-lg text-gray-700">Loading checkout...</p>;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
     {/* Animated subtle gradient overlay */}
<div className="absolute inset-0 bg-[length:400%_400%] animate-gradientBG pointer-events-none opacity-30"></div>

<div className="relative max-w-6xl mx-auto p-6 space-y-12">
  {/* Booked Packages Section */}
  <section>
    <Button
      className="mb-6 bg-purple-600 hover:bg-purple-700 text-white shadow-lg rounded-xl px-6 py-3 font-semibold transition-all duration-300"
      onClick={() => setShowBooked(!showBooked)}
    >
      {showBooked ? "Hide" : "Show"} Booked Packages
    </Button>

    {showBooked && (
      <div className="p-6 bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 animate-fadeIn">
        <h2 className="text-3xl font-extrabold mb-8 text-gray-900 tracking-tight">
          Your Booked Packages
        </h2>
        {booked.length === 0 ? (
          <p className="text-gray-700 text-lg">No completed bookings yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {booked
              .filter((item) => item.payment_status === "complete")
              .map((item, index) => (
                <Card
                  key={`booked-${item.product_id}-${index}`}
                  className="p-5 shadow-2xl hover:scale-105 hover:shadow-3xl transition-transform duration-300 rounded-3xl bg-white/40 backdrop-blur-lg border border-white/25"
                >
                  <TravelProductCard1 productId={item.product_id} />

                  <div className="mt-4 space-y-1">
                    <p className="text-green-700 font-bold text-lg">
                      ₹{item.pricing?.inr?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Booked on {new Date(item.booked_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs mt-1 text-green-600 font-semibold">
                      Status: {item.payment_status}
                    </p>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    )}
  </section>

  {/* Cart Section */}
  <section>
    <h2 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">
      Your Cart
    </h2>
    {cart.length === 0 ? (
      <Card className="p-8 text-center bg-white/40 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
        <p className="text-gray-700 mb-6 text-lg">No trips added yet.</p>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-xl px-6 py-3 font-semibold transition-all duration-300"
          onClick={handleAddTrip}
        >
          Plan a Trip
        </Button>
      </Card>
    ) : (
      <div className="grid md:grid-cols-2 gap-8">
        {cart.map((item, index) => (
          <div key={`cart-${item.product_id}-${index}`} className="relative">
            <TravelProductCard1
              productId={item.product_id}
              onDelete={() => handleRemove(item.product_id)}
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-3 right-3 bg-red-100 text-red-700 hover:bg-red-200 border-none shadow-md transition-all rounded-full px-3 py-1 font-semibold"
              onClick={() => handleRemove(item.product_id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    )}
    <div className="mt-8">
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-xl px-6 py-3 font-semibold transition-all duration-300"
        onClick={handleAddTrip}
      >
        + Add Another Trip
      </Button>
    </div>
  </section>


        {/* Currency Tabs */}
<section>
  <h2 className="text-3xl font-bold mb-6 text-gray-800">Select Currency</h2>
  <div className="flex gap-4 mb-6">
    <Button
      onClick={() => setCurrency("inr")}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 
        ${currency === "inr" 
          ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg" 
          : "bg-white text-black border border-gray-300 hover:scale-105 hover:shadow-lg"}`
      }
    >
      <Image src="/media/icons/inr.png" alt="INR" width={20} height={20} />
      INR
    </Button>

    <Button
      onClick={() => setCurrency("btc")}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 
        ${currency === "btc" 
          ? "bg-gradient-to-r from-orange-400 to-orange-500 text-black shadow-lg" 
          : "bg-white text-black border border-gray-300 hover:scale-105 hover:shadow-lg"}`
      }
    >
      <Image src="/media/icons/bitcoin.png" alt="BTC" width={20} height={20} />
      Bitcoin
    </Button>

    <Button
      onClick={() => setCurrency("eth")}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 
        ${currency === "eth" 
          ? "bg-gradient-to-r from-purple-400 to-purple-500 text-black shadow-lg" 
          : "bg-white text-black border border-gray-300 hover:scale-105 hover:shadow-lg"}`
      }
    >
      <Image src="/media/icons/ethereum.png" alt="ETH" width={20} height={20} />
      Ethereum
    </Button>
  </div>


          {/* Totals */}
          <Card className="p-6 shadow-2xl rounded-3xl bg-white/50 backdrop-blur-md border border-white/20">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Total Amount</h3>
            <p className="text-3xl font-bold mb-6 text-gray-900">
              {currency === "inr" && `₹${totals.inr.toLocaleString()}`}
              {currency === "btc" && `${totals.btc} BTC`}
              {currency === "eth" && `${totals.eth} ETH`}
            </p>
            <Button
              className="w-full py-3 text-lg bg-green-600 hover:bg-green-700 shadow-md rounded-2xl transition-all duration-300 text-white"
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              Proceed to Checkout
            </Button>
          </Card>
        </section>
      </div>

      <style jsx>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradientBG {
          animation: gradientBG 20s ease infinite;
        }
      `}</style>
    </div>
  );
}
