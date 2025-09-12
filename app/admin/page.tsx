"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import { uploadToCloudinary } from "../../utils/cloudinary/client";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";

// ✅ Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !profile || profile.role !== "admin") {
        router.replace("/login");
        return;
      }

      setLoading(false);
    };

    checkRole();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-100 to-purple-200">
        <div className="p-8 rounded-2xl shadow-lg bg-white text-center animate-pulse">
          <h1 className="text-2xl font-bold text-indigo-600">Checking access...</h1>
          <p className="mt-2 text-gray-600">Redirecting if unauthorized 🚀</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text 
             bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 drop-shadow-lg"
      >
        ⚙️ Admin Dashboard 🔧
      </motion.h1>

      <Tabs.Root defaultValue="places">
        <Tabs.List className="flex space-x-6 border-b border-gray-200 mb-6">
          <Tabs.Trigger
            value="places"
            className="px-6 py-3 font-semibold text-gray-600 rounded-t-xl transition
                       hover:text-indigo-600 hover:bg-indigo-50
                       data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500
                       data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Places
          </Tabs.Trigger>
          <Tabs.Trigger
            value="hotels"
            className="px-6 py-3 font-semibold text-gray-600 rounded-t-xl transition
                       hover:text-indigo-600 hover:bg-indigo-50
                       data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500
                       data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Hotels
          </Tabs.Trigger>
          <Tabs.Trigger
            value="events"
            className="px-6 py-3 font-semibold text-gray-600 rounded-t-xl transition
                       hover:text-indigo-600 hover:bg-indigo-50
                       data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500
                       data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Events
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="places">
          <PlacesAdmin />
        </Tabs.Content>
        <Tabs.Content value="hotels">
          <HotelsAdmin />
        </Tabs.Content>
        <Tabs.Content value="events">
          <EventsAdmin />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

/* ---------- Shared Upload Helper ---------- */
async function uploadImages(files: (File | null)[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    if (file) {
      const url = await uploadToCloudinary(file);
      urls.push(url);
    }
  }
  return urls;
}

/* ---------- Places ---------- */
function PlacesAdmin() {
  const [places, setPlaces] = useState<any[]>([]);
  const [newPlace, setNewPlace] = useState({
    name: "",
    category: "",
    lat: "",
    lon: "",
    city: "",
    google_map_link: "",
    entry_fee_inr: "Free",
    hours: "",
    tips: [""],
    description: "",
  });
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

  async function fetchPlaces() {
    const { data } = await supabase.from("places").select("*");
    if (data) setPlaces(data);
  }

  async function addPlace() {
    setUploadStatus("Uploading...");
    try {
      const imageUrls = await uploadImages(imageFiles);
      const response = await fetch("/api/embed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "places",
          data: {
            ...newPlace,
            lat: +newPlace.lat,
            lon: +newPlace.lon,
            images: imageUrls,
          },
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to add place");
      }
      
      setUploadStatus("Place added successfully!");
      setNewPlace({
        name: "",
        category: "",
        lat: "",
        lon: "",
        city: "",
        google_map_link: "",
        entry_fee_inr: "",
        hours: "",
        tips: [""],
        description: "",
      });
      setImageFiles([]);
      fetchPlaces();
      
      // Clear success message after 3 seconds
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (error: any) {
      console.error("Error adding place:", error);
      setUploadStatus(`Error: ${error.message}`);
    }
  }

  function handleImageChange(index: number, file: File | null) {
    const updated = [...imageFiles];
    updated[index] = file;
    setImageFiles(updated);
  }

  async function deletePlace(id: string) {
    await supabase.from("places").delete().eq("id", id);
    fetchPlaces();
  }

  return (
    <Section
      title="🏛 Manage Places"
      items={places}
      fields={[
        { placeholder: "Name", key: "name", required: true },
        { placeholder: "Category", key: "category", required: true },
        { placeholder: "Latitude", key: "lat", required: true },
        { placeholder: "Longitude", key: "lon", required: true },
        { placeholder: "City", key: "city", required: true },
        { placeholder: "Google Map Link", key: "google_map_link" },
        { placeholder: "Entry Fee (INR or Free)", key: "entry_fee_inr" },
        { placeholder: "Hours", key: "hours" },
        { placeholder: "Tips", key: "tips" },
      ]}
      descriptionKey="description"
      newItem={newPlace}
      setNewItem={setNewPlace}
      imageFiles={imageFiles}
      setImageFiles={setImageFiles}
      handleImageChange={handleImageChange}
      addItem={addPlace}
      deleteItem={deletePlace}
      uploadStatus={uploadStatus}
    />
  );
}

/* ---------- Hotels ---------- */
function HotelsAdmin() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [newHotel, setNewHotel] = useState({
    name: "",
    lat: "",
    lon: "",
    city: "",
    rating: "",
    price_band: "Budget", // Changed from priceBand to price_band
    google_map_link: "",
    description: "", // Added description field
  });
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  async function fetchHotels() {
    const { data } = await supabase.from("hotels").select("*");
    if (data) setHotels(data);
  }

  async function addHotel() {
    setUploadStatus("Uploading...");
    
    // Validate required fields
    if (!newHotel.name || !newHotel.lat || !newHotel.lon || !newHotel.city) {
      setUploadStatus("Error: Please fill in all required fields");
      return;
    }

    try {
      const imageUrls = await uploadImages(imageFiles);
      const response = await fetch("/api/embed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "hotels",
          data: {
            ...newHotel,
            lat: parseFloat(newHotel.lat),
            lon: parseFloat(newHotel.lon),
            rating: newHotel.rating ? parseFloat(newHotel.rating) : null,
            images: imageUrls,
          },
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to add hotel");
      }
      
      setUploadStatus("Hotel added successfully!");
      setNewHotel({
        name: "",
        lat: "",
        lon: "",
        city: "",
        rating: "",
        price_band: "Budget",
        google_map_link: "",
        description: "",
      });
      setImageFiles([]);
      fetchHotels();
      
      // Clear success message after 3 seconds
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (error: any) {
      console.error("Error adding hotel:", error);
      setUploadStatus(`Error: ${error.message}`);
    }
  }

  function handleImageChange(index: number, file: File | null) {
    const updated = [...imageFiles];
    updated[index] = file;
    setImageFiles(updated);
  }

  async function deleteHotel(id: string) {
    await supabase.from("hotels").delete().eq("id", id);
    fetchHotels();
  }

  return (
    <Section
      title="🏨 Manage Hotels"
      items={hotels}
      fields={[
        { placeholder: "Name", key: "name", required: true },
        { placeholder: "Latitude", key: "lat", required: true },
        { placeholder: "Longitude", key: "lon", required: true },
        { placeholder: "City", key: "city", required: true },
        { placeholder: "Rating (0-5)", key: "rating" },
        { placeholder: "Google Map Link", key: "google_map_link" },
      ]}
      selectField={{
        key: "price_band", // Changed from priceBand to price_band
        options: ["Budget", "Mid", "Premium"],
      }}
      descriptionKey="description"
      newItem={newHotel}
      setNewItem={setNewHotel}
      imageFiles={imageFiles}
      setImageFiles={setImageFiles}
      handleImageChange={handleImageChange}
      addItem={addHotel}
      deleteItem={deleteHotel}
      uploadStatus={uploadStatus}
    />
  );
}

/* ---------- Events ---------- */
function EventsAdmin() {
  const [events, setEvents] = useState<any[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    category: "",
    start_date: "",
    end_date: "",
    venue: "",
    city: "",
    description: "",
  });
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data } = await supabase.from("events").select("*");
    if (data) setEvents(data);
  }

  async function addEvent() {
    setUploadStatus("Uploading...");
    try {
      const id = crypto.randomUUID();
      const imageUrls = await uploadImages(imageFiles);
      const created_at = new Date().toISOString();
      const response = await fetch("/api/embed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "events",
          data: {
            id,
            ...newEvent,
            images: imageUrls,
            created_at,
          },
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to add event");
      }
      
      setUploadStatus("Event added successfully!");
      setNewEvent({
        title: "",
        category: "",
        start_date: "",
        end_date: "",
        venue: "",
        city: "",
        description: "",
      });
      setImageFiles([]);
      fetchEvents();
      
      // Clear success message after 3 seconds
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (error: any) {
      console.error("Error adding event:", error);
      setUploadStatus(`Error: ${error.message}`);
    }
  }

  function handleImageChange(index: number, file: File | null) {
    const updated = [...imageFiles];
    updated[index] = file;
    setImageFiles(updated);
  }

  async function deleteEvent(id: string) {
    await supabase.from("events").delete().eq("id", id);
    fetchEvents();
  }

  return (
    <Section
      title="🎉 Manage Events"
      items={events}
      fields={[
        { placeholder: "Title", key: "title", required: true },
        { placeholder: "Category", key: "category", required: true },
        { placeholder: "Start Date (YYYY-MM-DD)", key: "start_date", required: true },
        { placeholder: "End Date (YYYY-MM-DD)", key: "end_date" },
        { placeholder: "Venue", key: "venue" },
        { placeholder: "City", key: "city", required: true },
      ]}
      descriptionKey="description"
      newItem={newEvent}
      setNewItem={setNewEvent}
      imageFiles={imageFiles}
      setImageFiles={setImageFiles}
      handleImageChange={handleImageChange}
      addItem={addEvent}
      deleteItem={deleteEvent}
      uploadStatus={uploadStatus}
    />
  );
}

/* ---------- Reusable Section Component ---------- */
function Section({
  title,
  items,
  fields,
  selectField,
  descriptionKey,
  newItem,
  setNewItem,
  imageFiles,
  setImageFiles,
  handleImageChange,
  addItem,
  deleteItem,
  uploadStatus,
}: any) {
  // Drag and drop handler
  function handleDrop(e: React.DragEvent<HTMLLabelElement>, index: number) {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(index, e.dataTransfer.files[0]);
    }
  }

  // Remove image
  function removeImage(index: number) {
    const updated = [...imageFiles];
    updated.splice(index, 1);
    setImageFiles(updated);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      
      {uploadStatus && (
        <div className={`p-3 rounded-lg ${
          uploadStatus.includes("Error") 
            ? "bg-red-100 text-red-700" 
            : "bg-green-100 text-green-700"
        }`}>
          {uploadStatus}
        </div>
      )}
      
      <div className="bg-white border p-6 rounded-2xl shadow space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {fields.map((field: any) => (
            field.key === "tips" ? (
              <div key="tips" className="col-span-2">
                <label className="block text-gray-700 font-medium mb-1">Tips</label>
                {newItem.tips.map((tip: string, idx: number) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      className="border p-2 rounded-lg text-gray-900 flex-1"
                      placeholder={`Tip #${idx + 1}`}
                      value={tip}
                      onChange={e => {
                        const updated = [...newItem.tips];
                        updated[idx] = e.target.value;
                        setNewItem({ ...newItem, tips: updated });
                      }}
                    />
                    <button
                      type="button"
                      className="bg-red-500 text-white px-2 rounded"
                      onClick={() => {
                        const updated = [...newItem.tips];
                        updated.splice(idx, 1);
                        setNewItem({ ...newItem, tips: updated });
                      }}
                      disabled={newItem.tips.length === 1}
                    >
                      ❌
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="bg-indigo-500 text-white px-3 py-1 rounded"
                  onClick={() => setNewItem({ ...newItem, tips: [...newItem.tips, ""] })}
                >
                  ➕ Add Tip
                </button>
              </div>
            ) : (
              <div key={field.key} className="flex flex-col">
                <input
                  className="border p-2 rounded-lg text-gray-900"
                  placeholder={field.placeholder + (field.required ? " *" : "")}
                  value={newItem[field.key]}
                  onChange={(e) =>
                    setNewItem({ ...newItem, [field.key]: e.target.value })
                  }
                />
                {field.required && !newItem[field.key] && (
                  <span className="text-red-500 text-xs mt-1">This field is required</span>
                )}
              </div>
            )
          ))}
          {selectField && (
            <select
              className="border p-2 rounded-lg col-span-2 text-gray-900"
              value={newItem[selectField.key]}
              onChange={(e) =>
                setNewItem({ ...newItem, [selectField.key]: e.target.value })
              }
            >
              {selectField.options.map((opt: string) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}
        </div>
        {descriptionKey && (
          <textarea
            className="border p-2 w-full rounded-lg text-gray-900"
            placeholder="Description"
            rows={4}
            value={newItem[descriptionKey]}
            onChange={(e) =>
              setNewItem({ ...newItem, [descriptionKey]: e.target.value })
            }
          />
        )}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Upload Images</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {imageFiles.map((file: any, i: number) => (
              <label
                key={i}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, i)}
                className="border-2 border-dashed border-gray-400 rounded-lg h-24 flex items-center justify-center 
                           text-gray-800 font-semibold text-sm cursor-pointer hover:border-indigo-500 transition relative overflow-hidden"
              >
                {file ? (
                  <>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${i}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 text-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        removeImage(i);
                      }}
                    >
                      ❌
                    </button>
                  </>
                ) : (
                  <>+ Add</>
                )}
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    handleImageChange(i, e.target.files?.[0] || null)
                  }
                />
              </label>
            ))}
            {/* Add new image box */}
            <button
              type="button"
              onClick={() => setImageFiles([...imageFiles, null])}
              className="border-2 border-dashed border-gray-400 rounded-lg h-24 flex items-center justify-center 
                         text-gray-500 hover:border-indigo-500 transition"
            >
              ➕ Add More
            </button>
          </div>
        </div>
        <button
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          onClick={addItem}
          disabled={fields.some((field: any) => field.required && !newItem[field.key])}
        >
          ➕ Add
        </button>
      </div>

      <div className="bg-white border p-6 rounded-2xl shadow">
        <h3 className="text-xl font-semibold mb-4">Existing Items</h3>
        <ul className="divide-y divide-gray-200">
          {items.map((item: any) => (
            <li
              key={item.id}
              className="flex justify-between items-center py-3 px-2 hover:bg-gray-50 rounded-lg"
            >
              <span className="text-gray-900 font-semibold">
                {item.name || item.title}{" "}
                <span className="text-gray-600 font-medium">
                  ({item.city || item.start_date || ""})
                </span>
              </span>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => deleteItem(item.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}