import { NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const TRANSLATE_URL = "https://translation.googleapis.com/language/translate/v2";

export async function POST(request: any) {
  const { text, targetLanguage } = await request.json();

  const res = await fetch(`${TRANSLATE_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      target: targetLanguage,
      format: "text",
    }),
  });

  const data = await res.json();
  const translatedText = data.data.translations[0].translatedText;

  return NextResponse.json({ translatedText });
}
