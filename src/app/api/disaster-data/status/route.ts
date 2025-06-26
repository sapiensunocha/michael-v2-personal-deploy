import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://disaster-data-tracker-1044744936985.us-central1.run.app/status", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying status request:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch status data" },
      { status: 500 },
    );
  }
}

