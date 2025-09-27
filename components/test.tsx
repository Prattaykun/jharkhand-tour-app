"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Blockchain node URLs (your 3 deployed nodes)
const BLOCKCHAIN_NODES = [
  'https://your-node-1.com/api',
  'https://your-node-2.com/api',
  'https://your-node-3.com/api'
];

export default function RazorpayPage() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchCart = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("consumer_profiles")
        .select("booked_travels")
        .eq("id", user.id)
        .single();

      if (!error && data?.booked_travels) {
        const unpaidItems = data.booked_travels.filter(
          (item: any) => !item.payment_status
        );

        setCartItems(unpaidItems);

        const totalInr = unpaidItems.reduce(
          (acc: number, item: any) => acc + (item.pricing?.inr || 0),
          0
        );

        setTotal(totalInr);
      }
      setLoading(false);
    };

    fetchCart();
  }, []);

  const updateConsumerProfile = async (userId: string) => {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return;
    }

    const { error: updateError } = await supabase
      .from("consumer_profiles")
      .update({
        full_name: profileData.full_name,
        email: profileData.email
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating consumer profile:", updateError);
    }
  };

  const sendToBlockchain = async (transactionData: any) => {
    // Try each node until one responds
    for (const nodeUrl of BLOCKCHAIN_NODES) {
      try {
        const response = await fetch(`${nodeUrl}/transaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transactionData),
        });

        if (response.ok) {
          const result = await response.json();
          return result;
        }
      } catch (error) {
        console.warn(`Node ${nodeUrl} failed, trying next...`);
        continue;
      }
    }
    throw new Error('All blockchain nodes are unavailable');
  };

  const handlePayment = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Update consumer profile with full name and email
    await updateConsumerProfile(user.id);

    // Prepare blockchain transaction data
    const transactionData = {
      userId: user.id,
      fullName: user.user_metadata?.full_name || '',
      email: user.email || '',
      productIds: cartItems.map(item => item.product_id),
      categories: cartItems.map(item => item.category),
      paymentStatus: 'complete',
      totalAmount: total,
      timestamp: Date.now()
    };

    try {
      // Send to blockchain network
      const blockchainResult = await sendToBlockchain(transactionData);

      if (blockchainResult.success) {
        // Update local state immediately for better UX
        const updatedTravels = cartItems.map((item: any) => ({
          ...item,
          payment_status: "complete",
          blockchain_tx_hash: blockchainResult.transactionHash,
          block_hash: blockchainResult.blockHash,
          verified_at: new Date().toISOString()
        }));

        // Update Supabase (blockchain node will also update, but we do it here for immediate feedback)
        await supabase
          .from("consumer_profiles")
          .update({ booked_travels: updatedTravels })
          .eq("id", user.id);

        router.push("/TravelCheckout?blockchain=verified");
      } else {
        throw new Error('Blockchain verification failed');
      }
    } catch (error) {
      console.error('Blockchain error:', error);
      // Fallback: Update without blockchain verification
      const updatedTravels = cartItems.map((item: any) => ({
        ...item,
        payment_status: "complete",
        blockchain_verified: false
      }));

      await supabase
        .from("consumer_profiles")
        .update({ booked_travels: updatedTravels })
        .eq("id", user.id);

      router.push("/TravelCheckout?blockchain=fallback");
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Processing...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <Card className="p-10 max-w-md text-center shadow-2xl rounded-2xl bg-white">
        <h1 className="text-3xl font-bold mb-6">Secure Payment</h1>
        <p className="text-lg mb-2">Blockchain Verified Transaction</p>
        <p className="text-sm text-gray-600 mb-4">Your payment will be recorded on our secure blockchain network</p>
        <p className="text-lg mb-4">Amount to Pay:</p>
        <p className="text-4xl font-extrabold text-green-600 mb-6">
          ₹{total.toLocaleString()}
        </p>
        <Button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-3 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg rounded-xl transition-all duration-300"
        >
          {loading ? "Processing..." : "Pay Securely with Blockchain"}
        </Button>
        <p className="text-xs text-gray-500 mt-4">
          Verified by 3-node blockchain network
        </p>
      </Card>
    </div>
  );
}