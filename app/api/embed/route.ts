// api/embed/route.ts
import { NextResponse } from "next/server";
import { embeddingModel } from "@/lib/gemini";
import { supabase } from "@/utils/supabase/client";

export async function POST(req: Request) {
  try {
    const { type, data } = await req.json();

    if (!type || !data) {
      return NextResponse.json(
        { error: "Type and data are required" },
        { status: 400 }
      );
    }

    let embedText = "";

    switch(type) {
      case "places":
        embedText = `${data.name}. ${data.description}`;
        break;
      case "hotels":
        embedText = `${data.name}. ${data.city}. Rating: ${data.rating}`;
        break;
      case "events":
        embedText = `${data.title}. ${data.description}`;
        break;
      case "heritage_sites":
        embedText = `${data.name}. ${data.description}. Location: ${data.location}. Significance: ${data.significance || "N/A"}`;
        break;
      case "travel_products":
        const categoryTexts = (data.categories || [])
          .map((cat: any) => {
            const dayTexts = (cat.itinerary || [])
              .map((day: any) => {
                const sites = (day.sites || []).map((s: any) => s.name).join(", ");
                const foods = Object.values(day.food || {})
                  .flatMap((meal: any) => (meal.items || []).map((it: any) => it.name))
                  .join(", ");
                return `Day ${day.dayNumber}: Sites [${sites}]. Foods [${foods}]`;
              })
              .join(" | ");
            return `${cat.categoryName} (${cat.days}D/${cat.nights}N via ${cat.travelMode}). ${dayTexts}`;
          })
          .join(" || ");
        embedText = `${data.package_name}. ${categoryTexts}`;
        break;
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Generate embedding from Gemini
    const result = await embeddingModel.embedContent(embedText);
    const embedding = result.embedding?.values;

    if (!embedding) {
      console.error("No embedding returned from Gemini:", result);
      return NextResponse.json({ error: "Failed to generate embedding" }, { status: 500 });
    }

    // Insert into Supabase
    const { error } = await supabase.from(type).insert([{ ...data, embedding }]);
    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to insert record" }, { status: 500 });
    }

    return NextResponse.json({ message: `${type} added successfully` });

  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
