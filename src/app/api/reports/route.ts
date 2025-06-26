// src/app/api/reports/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Fetch reports logic
  return NextResponse.json([]);
}

export async function POST(request: Request) {
  const report = await request.json();
  // Submit report logic
  return NextResponse.json(report);
}