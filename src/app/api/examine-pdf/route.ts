import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    console.log("Received POST request");
    const formData = await request.formData();
    const file = formData.get("fileToUpload") as File;
    const eventCategory = formData.get("eventCategory") as string;

    console.log("FormData received:", {
      fileExists: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      eventCategory,
    });

    if (!file) {
      console.log("No file provided in request");
      return NextResponse.json(
        { success: false, error: "No PDF file provided" },
        { status: 400 },
      );
    }

    // Convert the file to array buffer
    const buffer = await file.arrayBuffer();
    console.log("File buffer size:", buffer.byteLength);

    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: "application/pdf" });

    // Use LangChain's PDFLoader
    const loader = new PDFLoader(blob);
    const docs = await loader.load();

    // Combine all pages' content
    const textContent = docs.map((doc: any) => doc.pageContent).join("\n");

    console.log("Extracted text:", textContent);

    if (!textContent.trim())
      return NextResponse.json(
        { success: false, error: "No text content found in PDF" },
        { status: 400 },
      );

    const prompt = `Extract disaster event information from the following text. Format the response as a JSON object with these exact fields:
    - eventType: A two-letter code representing the event type (e.g., "TE" for terrorism, "FL" for flood, "EQ" for earthquake)
    - eventCategory: Use the provided event category
    - source: Source of the information (e.g., "pdf", "news", "gtd")
    - eventExternalId: Generate a unique identifier in format YYYYMMDDXXXX where XXXX is a sequential number
    - startDate: Date in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
    - affectedCountries: Array of affected countries or regions
    - location: Object with:
      - type: "Point"
      - coordinates: Array of [longitude, latitude] as numbers
    - gdtMetadata: Object with:
      - stateEvent: "continuous" or "punctual"
      - disasterType: Specific type of disaster
      - impact: Description of the impact
      - description: Brief summary of the event
      - affectedRegions: Array of affected regions
      - timestamp: Unix timestamp in milliseconds
    - rawData: Object with:
      - event_id: Same as eventExternalId
      - date_and_time: Original date format from text
      - affected_region: Region information
      - location: Array of coordinates as strings
      - event_state: "continuous" or "punctual"
      - type_of_disaster: Type of disaster
      - impact_of_disaster: Impact description
      - description: Full description

    Text to analyze: ${textContent}
    Event Category: ${eventCategory}

    If any field cannot be determined from the text, provide a reasonable default value related to the disaster type. For coordinates, if not found, provide an estimate based on the location mentioned.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a precise disaster information extraction system. Extract factual information from the provided text and format it according to the specified JSON structure. If specific information is not available, provide reasonable defaults related to the disaster context.",
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
    const fieldsToTranslate = ["disasterType", "impact", "description"];
    for (const field of fieldsToTranslate) {
      if (extractedData.gdtMetadata && extractedData.gdtMetadata[field]) {
        const translationCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content:
                "You are a translator. Translate the following text to English. Return only the translated text, nothing else.",
            },
            {
              role: "user",
              content: extractedData.gdtMetadata[field],
            },
          ],
          model: "gpt-4-turbo-preview",
          temperature: 0.3,
        });

        extractedData.gdtMetadata[field] =
          translationCompletion.choices[0].message.content?.trim() ||
          extractedData.gdtMetadata[field];
      }
    }

    return NextResponse.json({
      success: true,
      extractedData,
      file,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process PDF file",
      },
      { status: 500 },
    );
  }
}

// Helper function to generate MongoDB-like ObjectId
function generateObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, "0");
  const randomPart = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");

  return timestamp + randomPart.substring(0, 16);
}
