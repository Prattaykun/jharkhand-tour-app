// app/plantrip/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import TravelProductCard from "@/components/travel/TravelProductCard2";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash.debounce";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PAGE_SIZE = 12;

export default function PlanTripPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  // --- Fetch paginated travel packages (default) ---
  const fetchProducts = async (pageNumber: number) => {
    setLoading(true);
    const from = (pageNumber - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await supabase
      .from("travel_products")
      .select("*", { count: "exact" })
      .range(from, to);

    if (!error) {
      setProducts(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  // --- Vector Search API Call ---
  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      fetchProducts(1);
      setPage(1);
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);

   // Step 1: get embedding
const embeddingResponse = await fetch("/api/search-embed", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ input: query }),
});

      const { embedding } = await embeddingResponse.json();

// Step 2: call travel search API
const response = await fetch("/api/travel-search", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ embedding, query, limit: 50 }),
});

      const { results } = await response.json();
      setProducts(results || []);
      setTotalCount(results?.length || 0);
      setPage(1);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search handler (1s delay)
  const debouncedSearch = useCallback(
    debounce((q: string) => {
      searchProducts(q);
    }, 1000),
    []
  );

  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    } else {
      fetchProducts(1);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!isSearching) fetchProducts(page);
  }, [page]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-start justify-center py-16 px-4">
    <div className="w-full max-w-7xl bg-white bg-opacity-90 shadow-xl rounded-3xl p-10">
      {/* Search Bar */}
<div className="relative mb-12 max-w-3xl mx-auto">
  <Input
    type="text"
    placeholder="Search travel packages..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-14 pr-5 py-3 rounded-2xl border border-gray-300
               text-black placeholder-black bg-white
               focus:outline-none focus:ring-4 focus:ring-amber-400 focus:ring-opacity-50
               focus:border-amber-400 shadow-md hover:shadow-lg
               transition-all duration-300"
  />
  <span className="absolute left-5 top-3.5 text-black pointer-events-none text-xl select-none">
    🔍
  </span>
</div>


      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center h-[60vh] text-xl text-gray-500 animate-pulse font-semibold">
          Loading travel packages...
        </div>
      ) : products.length > 0 ? (
        <>
          <motion.div
            layout
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence>
              {products
                .slice(
                  (page - 1) * PAGE_SIZE,
                  isSearching ? products.length : page * PAGE_SIZE
                )
                .map((product) => (
                  <motion.div
                    key={product.product_id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-full"
                  >
                    <TravelProductCard productId={product.product_id} />
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          {!isSearching && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12 flex-wrap">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold transition-colors"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-5 py-2 rounded-lg font-semibold transition-colors ${
                    page === p
                      ? "bg-primary text-white shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-xl text-gray-500 mt-28 font-light italic">
          No packages found. Try another search.
        </p>
      )}
    </div>
  </div>
);
}