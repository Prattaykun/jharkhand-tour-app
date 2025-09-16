"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type HeritageItem = {
  id: string;
  name: string;
  location: string;
  description: string;
  significance?: string;
  image_url?: string;
  embedding?: number[];
  entry_fee?: string; // ✅ added entry_fee
};

export default function HeritagePage() {
  const [query, setQuery] = useState("");
  const [heritage, setHeritage] = useState<HeritageItem[]>([]);
  const [selected, setSelected] = useState<HeritageItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeritage = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("heritage_sites")
        .select("*")
        .order("name", { ascending: true });

      if (error) console.error(error);
      else setHeritage(data || []);
      setLoading(false);
    };
    fetchHeritage();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return heritage.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q)
    );
  }, [query, heritage]);

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <section className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Heritage Sites of Jharkhand</h1>
        <p className="text-gray-600 mb-6">Explore cultural and historical heritage sites across the state.</p>

        <div className="flex mb-8 gap-4 items-center">
          <input
            type="text"
            placeholder="Search heritage sites..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border rounded-full focus:ring-2 focus:ring-green-500 text-gray-900"
          />
        </div>

        {loading ? (
          <p className="text-gray-500 text-center">Loading heritage sites...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center">No heritage sites found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((h) => (
              <div key={h.id} className="bg-white rounded-2xl shadow overflow-hidden flex flex-col">
                <div className="h-44 w-full relative bg-gray-100">
                  {h.image_url ? (
                    <img src={h.image_url} alt={h.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>

               <div className="p-5 flex-1 flex flex-col">
  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{h.name}</h3>
  <p className="mt-2 text-sm text-gray-600 flex-1 line-clamp-3">{h.description}</p>
  <div className="mt-2 text-sm text-gray-500">📍 {h.location}</div>
  {h.significance && <div className="mt-1 text-sm text-gray-500">✨ {h.significance}</div>}
  {h.entry_fee && <div className="mt-1 text-sm text-gray-500">💰 Entry Fee: {h.entry_fee}</div>}  {/* ✅ Added entry fee */}

  <button
    onClick={() => setSelected(h)}
    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
  >
    View Details
  </button>
</div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="relative h-48 sm:h-64 w-full">
              {selected.image_url ? (
                <img src={selected.image_url} alt={selected.name} className="w-full h-full object-cover rounded-t-2xl" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 rounded-t-2xl">No image</div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-4">
                <h2 className="text-2xl font-bold text-white">{selected.name}</h2>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/90"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-700">{selected.description}</p>
              <p className="text-gray-600">📍 Location: {selected.location}</p>
              {selected.significance && <p className="text-gray-600">✨ Significance: {selected.significance}</p>}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
