import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { textContent, eventCategory } = await request.json();

    if (!textContent) {
      return NextResponse.json(
        { success: false, error: "No text content provided" },
        { status: 400 },
      );
    }

    const prompt = `Extract disaster event information from the following text. Format the response as a JSON object with these exact fields:
    - event_id (generate a unique identifier)
    - date (in YYYY-MM-DD format)
    - time (in HH:mm format, use "00:00" if not specified)
    - location (specific place and/or coordinates)
    - state_event ("continuous" or "punctual")
    - disaster_type (specific type of disaster)
    - killed (number, use 0 if not specified)
    - people_affected (number, use 0 if not specified)
    - length_affected (number in kilometers, use 0 if not specified)
    - description (brief summary)
    - metadata (any additional relevant information)

    Text to analyze: ${textContent}
    Event Category: ${eventCategory}

    Ensure all fields are present in the response, using "unknown" for text fields or 0 for numeric fields if the information cannot be determined from the text.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a precise disaster information extraction system. Extract only factual information from the provided text and format it according to the specified JSON structure. Do not make assumptions or add information not present in the text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const extractedData = JSON.parse(
      completion.choices[0].message.content || "",
    );

    // Translate relevant fields to English
    const fieldsToTranslate = ["location", "state_event", "disaster_type"];
    for (const field of fieldsToTranslate) {
      if (extractedData[field] && extractedData[field] !== "unknown") {
        const translationCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content:
                "You are a translator. Translate the following text to English. Return only the translated text, nothing else.",
            },
            {
              role: "user",
              content: extractedData[field],
            },
          ],
          model: "gpt-4-turbo-preview",
          temperature: 0.3,
        });

        extractedData[field] =
          translationCompletion.choices[0].message.content?.trim() ||
          extractedData[field];
      }
    }

    // Validate the response structure
    const requiredFields = [
      "event_id",
      "date",
      "time",
      "location",
      "state_event",
      "disaster_type",
      "killed",
      "people_affected",
      "length_affected",
      "description",
      "metadata",
    ];

    const missingFields = requiredFields.filter(
      (field) => !(field in extractedData),
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 422 },
      );
    }

    // Convert numeric fields to numbers
    extractedData.killed = Number(extractedData.killed) || 0;
    extractedData.people_affected = Number(extractedData.people_affected) || 0;
    extractedData.length_affected = Number(extractedData.length_affected) || 0;

    return NextResponse.json({
      success: true,
      extractedData,
    });
  } catch (error) {
    console.error("Error processing text:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process text content",
      },
      { status: 500 },
    );
  }
}
