// app/api/generate-tour-plan/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    const tourData = await request.json();

    // If Gemini is not configured, return a sample response
    if (!genAI) {
      console.warn('GEMINI_API_KEY not configured, returning sample response');
      return NextResponse.json({ 
        plan: generateSampleResponse(tourData),
        note: 'This is a sample response as Gemini API is not configured'
      });
    }

    // Build the prompt with saved places if included
    let savedPlacesPrompt = '';
    if (tourData.includeSavedPlaces && tourData.savedPlaces && tourData.savedPlaces.length > 0) {
      savedPlacesPrompt = `- Must include these specific places: ${tourData.savedPlaces.map((p: any) => `${p.name}${p.city ? ` in ${p.city}` : ''}`).join(', ')}\n`;
    }

    const prompt = `
      Create a highly engaging, visually appealing, and catchy tour plan for Jharkhand based on the following preferences:
      - Starting point: ${tourData.startingPoint}
      - Duration: ${tourData.days} days, ${tourData.nights} nights
      - Budget: INR ${tourData.budget}
      - Journey type: ${tourData.journeyType}
      - Interests: ${tourData.categories.join(', ')}
      - Accommodation preference: ${tourData.hotelPreference}
      ${savedPlacesPrompt}
      ${tourData.interestedInEvents && tourData.selectedEvents ? `- Interested in events: Yes, including ${tourData.selectedEvents.map((e: any) => e.title).join(', ')}` : ''}
      ${tourData.additionalRequirements && tourData.additionalRequirements !== "None" ? `- Additional requirements: ${tourData.additionalRequirements}` : ''}

      Please create an extremely engaging, well-structured itinerary that includes:
      1. A catchy, attention-grabbing title for the tour with emojis
      2. Daily breakdown with morning, afternoon, and evening activities with exciting descriptions
      3. Recommendations for places to eat local Jharkhandi cuisine with must-try dishes like Thekua, Dhuska, Rugra, Handia
      4. Accommodation suggestions matching the preference with brief highlights
      5. Transportation tips between locations with estimated times
      6. Estimated costs for major activities
      7. Cultural tips and etiquette reminders (e.g., respecting tribal customs, temple rules)
      8. Safety recommendations for forests, waterfalls, and ropeway rides
      9. A colorful HTML-based flow chart using div elements with Tailwind CSS classes to visualize the travel flow between locations and accommodations
      10. Fun facts and hidden gems about each location (e.g., Netarhat Sunset, Patratu Valley, Baba Baidyanath Temple)
      11. Photo opportunities suggestions for Instagram-worthy shots
      12. Packing recommendations based on the itinerary (cotton clothes, trekking shoes, woolens for hills)

      Format the response in clean HTML with proper structure but NO inline styles. Use semantic HTML tags like:
      <h1>, <h2>, <h3> for headings
      <p> for paragraphs
      <ul> and <li> for lists
      <strong> for emphasis
      <div> with clear class names that would work with Tailwind CSS

      IMPORTANT: For the flow chart, use HTML div elements with Tailwind CSS classes for colors and styling.
      Do NOT use ASCII art or markdown formatting. Return only clean HTML.

      Focus on showcasing the tribal culture, natural beauty, waterfalls, temples, and adventure of Jharkhand with vibrant, exciting language.
      Use a colorful HTML-based flow chart to visualize the journey between Ranchi, Netarhat, Deoghar, and nearby attractions.
      
      ${tourData.additionalRequirements && tourData.additionalRequirements !== "None" ? 'IMPORTANT: Make sure to address the additional requirements mentioned above in your itinerary.' : ''}
      
      ${savedPlacesPrompt ? 'IMPORTANT: The itinerary MUST include all the specific places mentioned above.' : ''}

      Make the response so engaging that the user feels excited to embark on this journey immediately!
      Use emojis sparingly to highlight key points and make the content more visually appealing.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```html|```/g, '').trim();

    return NextResponse.json({ plan: text });

  } catch (error) {
    console.error('Error generating tour plan:', error);
    
    // Return a sample response if Gemini API fails
    try {
      const tourData = await request.json();
      return NextResponse.json({ 
        plan: generateSampleResponse(tourData),
        note: 'This is a fallback response due to API error'
      });
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Failed to generate tour plan and parse request' },
        { status: 500 }
      );
    }
  }
}

// Fallback function to generate a sample response
function generateSampleResponse(tourData: any) {
  // Include saved places in the sample response if applicable
  let savedPlacesSection = '';
  if (tourData.includeSavedPlaces && tourData.savedPlaces && tourData.savedPlaces.length > 0) {
    savedPlacesSection = `
      <div class="bg-green-50 p-4 rounded-lg mb-6">
        <h2 class="text-xl font-semibold text-green-800 mb-2">Including Your Saved Places</h2>
        <ul class="list-disc list-inside text-gray-700">
          ${tourData.savedPlaces.map((p: any) => `<li>${p.name}${p.city ? ` in ${p.city}` : ''}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  
 return `
  <div class="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg transition-colors duration-500">
    <h1 class="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mb-4">
      Discover Jharkhand: Land of Forests & Heritage
    </h1>
    <p class="text-gray-600 dark:text-gray-300 mb-6">
      Your personalized ${tourData.days}-day journey through the heart of Jharkhand
    </p>
    
    ${savedPlacesSection}
    
    <div class="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg mb-6">
      <h2 class="text-xl font-semibold text-emerald-800 dark:text-emerald-300 mb-2">Tour Overview</h2>
      <ul class="list-disc list-inside text-gray-700 dark:text-gray-300">
        <li><strong>Starting Point:</strong> ${tourData.startingPoint}</li>
        <li><strong>Duration:</strong> ${tourData.days} days, ${tourData.nights} nights</li>
        <li><strong>Budget:</strong> ₹${tourData.budget.toLocaleString('en-IN')}</li>
        <li><strong>Travel Style:</strong> ${tourData.journeyType}</li>
        <li><strong>Interests:</strong> ${tourData.categories.join(', ')}</li>
        ${tourData.interestedInEvents && tourData.selectedEvents ? `<li><strong>Events:</strong> ${tourData.selectedEvents.map((e: any) => e.title).join(', ')}</li>` : ''}
        ${tourData.additionalRequirements && tourData.additionalRequirements !== "None" ? `<li><strong>Additional Requirements:</strong> ${tourData.additionalRequirements}</li>` : ''}
      </ul>
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">Your Journey Flow</h2>
      ${generateColorfulFlowChart(tourData)}
    </div>
  </div>
      <h2 class="text-2xl font-bold text-emerald-700 mb-4">Sample Itinerary</h2>
      
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-emerald-600 mb-2">Day 1: Arrival in Ranchi - The City of Waterfalls 🌊</h3>
        <div class="ml-4">
          <p class="text-gray-700"><strong>Morning:</strong> Arrive at ${tourData.startingPoint}. Transfer to your ${tourData.hotelPreference.toLowerCase()} hotel. Freshen up and enjoy local breakfast.</p>
          <p class="text-gray-700"><strong>Afternoon:</strong> Visit Dassam Falls, Jonha Falls, and Ranchi Lake.</p>
          <p class="text-gray-700"><strong>Evening:</strong> Explore Rock Garden and Tagore Hill for sunset views.</p>
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-emerald-600 mb-2">Day 2: Netarhat – The Queen of Chotanagpur Hills 🌄</h3>
        <div class="ml-4">
          <p class="text-gray-700"><strong>Morning:</strong> Drive to Netarhat. Check into hotel/resort.</p>
          <p class="text-gray-700"><strong>Afternoon:</strong> Visit Netarhat Dam and Koel View Point.</p>
          <p class="text-gray-700"><strong>Evening:</strong> Enjoy the mesmerizing Netarhat sunset point.</p>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-xl font-semibold text-emerald-600 mb-2">Day 3: Deoghar – Temple City of Jharkhand 🛕</h3>
        <div class="ml-4">
          <p class="text-gray-700"><strong>Morning:</strong> Travel to Deoghar. Visit Baba Baidyanath Jyotirlinga temple.</p>
          <p class="text-gray-700"><strong>Afternoon:</strong> Explore Naulakha Temple and Trikuta Hills (ropeway ride).</p>
          <p class="text-gray-700"><strong>Evening:</strong> Experience local street food and evening aarti.</p>
        </div>
      </div>
      
      <div class="bg-emerald-50 p-4 rounded-lg mb-6">
        <h2 class="text-xl font-semibold text-emerald-800 mb-2">Travel Tips ✨</h2>
        <ul class="list-disc list-inside text-gray-700">
          <li>Carry light woolens if visiting Netarhat in winter</li>
          <li>Respect local tribal traditions when visiting villages</li>
          <li>Try Jharkhandi dishes like Thekua, Rugra, and Dhuska</li>
          <li>Stay hydrated during treks and waterfall visits</li>
          <li>Plan temple visits early morning to avoid crowds</li>
        </ul>
      </div>

      <div class="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 class="text-xl font-semibold text-blue-800 mb-2">Packing Essentials 🎒</h2>
        <ul class="list-disc list-inside text-gray-700">
          <li>Comfortable walking shoes</li>
          <li>Light cotton clothing</li>
          <li>Woolen jacket for hilly regions</li>
          <li>Camera for capturing landscapes</li>
          <li>Power bank & flashlight</li>
        </ul>
      </div>
      
      <div class="bg-green-50 p-4 rounded-lg">
        <h2 class="text-xl font-semibold text-green-800 mb-2">Note</h2>
        <p class="text-green-700">This is a sample itinerary. For a fully personalized plan based on your preferences, please ensure your Gemini API key is properly configured.</p>
      </div>
    </div>
  `;
}

// Optimized Flowchart
function generateColorfulFlowChart(tourData: any): string {
  return `
  <div class="flowchart-container overflow-x-auto py-4">
    <div class="flowchart flex flex-col items-center gap-4 min-w-[800px] p-4">

      <!-- Start -->
      <div class="flowchart-step bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-700 text-white font-semibold p-4 rounded-xl text-center shadow-lg">
        Starting Point: ${tourData.startingPoint.split(',')[0]}
      </div>

      <!-- Arrow -->
      <div class="h-6 w-1 bg-gradient-to-b from-blue-400 to-purple-400 dark:from-blue-600 dark:to-purple-700"></div>

      <!-- Day 1 -->
      <div class="flowchart-step bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-purple-500 dark:to-indigo-700 text-white p-4 rounded-xl text-center shadow-lg">
        Day 1: Explore Ranchi (Waterfalls & Hills)
      </div>

      <div class="h-6 w-1 bg-gradient-to-b from-purple-400 to-green-400 dark:from-purple-600 dark:to-green-700"></div>

      <!-- Day 2 -->
      <div class="flowchart-step bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-500 dark:to-teal-700 text-white p-4 rounded-xl text-center shadow-lg">
        Day 2: Netarhat (Sunset & Hills)
      </div>

      <div class="h-6 w-1 bg-gradient-to-b from-green-400 to-yellow-400 dark:from-green-600 dark:to-yellow-700"></div>

      <!-- Day 3 -->
      <div class="flowchart-step bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-700 text-gray-900 dark:text-white p-4 rounded-xl text-center shadow-lg">
        Day 3: Deoghar (Temple & Ropeway)
      </div>

      <div class="h-6 w-1 bg-gradient-to-b from-orange-400 to-red-400 dark:from-orange-600 dark:to-red-700"></div>

      <!-- End -->
      <div class="flowchart-step bg-gradient-to-r from-red-600 to-pink-500 dark:from-red-500 dark:to-pink-700 text-white p-4 rounded-xl text-center shadow-lg">
        Return Journey
      </div>
    </div>
  </div>
  
  <h3 class="text-lg font-semibold mt-8 mb-4 text-gray-700">Accommodation Flow</h3>
  <div class="flowchart-container overflow-x-auto py-4">
    <div class="flowchart-branch flex justify-center gap-8 relative">
      <div class="branch-column flex flex-col items-center z-10">
        <div class="flowchart-step bg-blue-200 text-blue-800 p-4 rounded-lg text-center min-w-[200px] shadow-md">
          Ranchi<br>${tourData.hotelPreference} Hotel
        </div>
      </div>
      
      <div class="branch-column flex flex-col items-center z-10">
        <div class="flowchart-step bg-green-200 text-green-800 p-4 rounded-lg text-center min-w-[200px] shadow-md">
          Netarhat<br>${tourData.hotelPreference} Hotel
        </div>
      </div>
      
      <div class="branch-column flex flex-col items-center z-10">
        <div class="flowchart-step bg-yellow-200 text-yellow-800 p-4 rounded-lg text-center min-w-[200px] shadow-md">
          Deoghar<br>${tourData.hotelPreference} Hotel
        </div>
      </div>
    </div>
  </div>
  `;
}
