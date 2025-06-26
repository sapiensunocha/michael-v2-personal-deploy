import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch("https://disaster-data-tracker-1044744936985.us-central1.run.app/crawl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying crawl request:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to trigger crawl" },
      { status: 500 },
    );
  }
}

