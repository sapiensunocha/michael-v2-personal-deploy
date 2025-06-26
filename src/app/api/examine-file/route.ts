import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import * as XLSX from "xlsx-js-style";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Read the Excel file
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Get column headers (first row)
    const headers = jsonData[0] as string[];

    console.log("headers", headers);

    // Create a sample of the data for OpenAI to analyze
    const sampleData = jsonData.slice(1, 4); // Take a few rows as sample

    // Prepare the prompt for OpenAI
    const prompt = `Analyze these Excel column headers and their sample data:
    Headers: ${JSON.stringify(headers)}
    Sample data: ${JSON.stringify(sampleData)}

    Map these columns to our required fields:
    - date
    - time
    - location
    - disasterType
    - killed (number)
    - peopleAffected (number)
    - lengthAffected (number)
    - description

    Return a JSON object with the mapping of original column names to our required fields.
    If a required field doesn't have a matching column, mark it as null.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      response_format: { type: "json_object" },
    });

    const mappings = JSON.parse(completion.choices[0].message.content ?? "");

    return NextResponse.json({
      success: true,
      mappings,
      originalHeaders: headers,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 },
    );
  }
}
