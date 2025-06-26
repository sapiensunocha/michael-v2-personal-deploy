// src/app/api/firms-proxy/route.ts
// This is a Next.js API Route for App Router (app directory)

// IMPORTANT: In a production app, store your API key in an environment variable (e.g., process.env.FIRMS_API_KEY)
// For this demonstration, we"ll use it directly as provided.
const FIRMS_API_KEY = process.env.FIRMS_API_KEY || "758eeceef8ce5bf27161fdbd3d80e36e"; // Use environment variable if set
const FIRMS_BASE_URL = "https://firms.modaps.eosdis.nasa.gov/api/area/json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || "MODIS_NRT";
  const area = searchParams.get("area") || "world";
  const days = searchParams.get("days") || "1";

  const firmsApiUrl = `${FIRMS_BASE_URL}/${FIRMS_API_KEY}/${source}/${area}/${days}`;

  // Log to SERVER TERMINAL
  console.log(`[SERVER PROXY] Fetching FIRMS data from: ${firmsApiUrl}`);

  try {
    const firmsResponse = await fetch(firmsApiUrl);

    // Log to SERVER TERMINAL
    console.log(`[SERVER PROXY] FIRMS API Response Status: ${firmsResponse.status}`);

    if (!firmsResponse.ok) {
      const errorBody = await firmsResponse.text();
      // Log to SERVER TERMINAL
      console.error(`[SERVER PROXY] FIRMS API Error: ${firmsResponse.status} - ${errorBody}`);
      return new Response(JSON.stringify({ error: `FIRMS API Error: ${firmsResponse.status}`, details: errorBody }), {
        status: firmsResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const contentType = firmsResponse.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        const responseText = await firmsResponse.text();
        // Log to SERVER TERMINAL
        console.error("[SERVER PROXY] FIRMS API did not return JSON. Content-Type:", contentType, "Response (partial):", responseText.substring(0, 500));
        return new Response(JSON.stringify({ error: "FIRMS API did not return JSON", received: responseText.substring(0, 500) }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    const data = await firmsResponse.json();
    // Log to SERVER TERMINAL
    console.log(`[SERVER PROXY] Successfully received ${data.length > 0 ? data.length -1 : 0} incidents from FIRMS API.`); // -1 for headers row

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    // Log to SERVER TERMINAL
    console.error("[SERVER PROXY] Caught error during FIRMS fetch:`, error.message");
    return new Response(JSON.stringify({ error: "Failed to fetch FIRMS data", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}