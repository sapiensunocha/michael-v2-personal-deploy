import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Video = buffer.toString("base64");

    const prompt = `Analyze this video frame and extract the following information if visible. 
    If the text is in a non-English language, please translate the information to English:
    - date
    - time
    - location
    - disaster type
    - number of people killed
    - number of people affected
    - length of area affected
    - description of the event

    Return the information in a JSON format with these exact keys:
    date, time, location, disasterType, killed, peopleAffected, lengthAffected, description.
    If any field is not visible or cannot be determined, use null.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:video/mp4;base64,${base64Video}`,
              },
            },
          ],
        },
      ],
      //   max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const extractedData = JSON.parse(
      completion.choices[0].message.content ?? "{}",
    );

    return NextResponse.json({
      success: true,
      extractedData,
    });
  } catch (error) {
    console.error("Error processing video:", error);
    return NextResponse.json(
      { error: "Failed to process video" },
      { status: 500 },
    );
  }
}
