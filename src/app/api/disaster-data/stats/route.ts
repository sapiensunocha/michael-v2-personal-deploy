import { NextResponse } from "next/server";

// API route to proxy requests to the disaster stats endpoint
export async function GET() {
  try {
    console.log("Proxying stats request to external API...");
    // Use server-side fetch to bypass CORS restrictions
    const response = await fetch("https://disaster-data-tracker-1044744936985.us-central1.run.app/stats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add cache: 'no-store' to prevent caching
      cache: "no-store",
    });

    console.log(`Stats API response status: ${response.status}`);

    // If the API returns an error, we'll handle it gracefully
    if (!response.ok) {
      console.warn(`External API returned status: ${response.status}`);

      // Instead of throwing an error, return a structured error response
      return NextResponse.json(
        {
          error: `API responded with status: ${response.status}`,
          message:
            "Stats endpoint is currently unavailable. The application will use event data to generate statistics.",
        },
        { status: 200 }, // Return 200 OK to the client so the app can continue
      );
    }

    // Get the data from the response
    const data = await response.json();

    // Return the data with appropriate headers
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying stats request:", error);

    // Return a structured error response with 200 status
    return NextResponse.json(
      {
        error: "Failed to fetch disaster stats",
        message: "Stats endpoint is currently unavailable. The application will use event data to generate statistics.",
      },
      { status: 200 }, // Return 200 OK to the client so the app can continue
    );
  }
}

