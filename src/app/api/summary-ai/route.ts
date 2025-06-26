import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.nextUrl);
  const longitude = searchParams.get("longitude");
  const latitude = searchParams.get("latitude");

  if (!longitude || !latitude) {
    return NextResponse.json(
      { error: "Missing longitude or latitude" },
      { status: 400 },
    );
  }

  try {
    const url = "https://michael-1044744936985.us-central1.run.app/chat";
    const reqBody = {
      message: `Disasters based on the country that corresponds to the coordinates of longitude: ${longitude} and latitude: ${latitude}`,
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const disasterData = await response.text();

    const prompt = `Generate a disaster alert summary (max 300 characters) based on this response: ${disasterData}   

Output a **concise one-liner summary** with the following:  
- Disaster Type  
- Severity Level  
- Nearest Location  
- Key Impact (e.g., fatalities, damage, warnings)  
- Critical Advisory  

Example Output:  
"High-magnitude earthquake near Accra, Ghana. Significant damage, 500,000 affected. Tsunami warning issued—evacuate to higher ground."  

Ensure that the summary is focuses exactly in the country where this longitude ${longitude} and this
 latitude ${latitude} are located(mention the affected areas if you spot them) and if you the response didn't provide anything about that region, say there is no disaster spoted
  in the area corresponding to those coordinates, just be creative on that, lastly, make sure the response is **brief, structured,
   and clear**, avoiding excess details or formatting. and add no quotes.`;
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      response_format: { type: "text" },
    });

    return NextResponse.json({
      completion: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Failed to generate prompt", error);
    return NextResponse.json(
      { error: "Failed to generate prompt" },
      { status: 500 },
    );
  }
}
