import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { Resend } from "resend";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { longitude, latitude, email } = await req.json();
  try {
    const prompt = `
      Generate a disaster alert based on the following coordinates:

**Longitude:** ${longitude}  
**Latitude:** ${latitude}  

Format the alert in **clear, structured text** for email distribution. Include the following details:

---

🔴 **DISASTER ALERT** 🔴  
📅 **Date & Time (UTC):** [current date and time of the location using the [DD-DD-YYYY] format]  
📍 **Location:** [Nearest city, region, country]  
🌍 **Coordinates:** (Latitude: {latitude}, Longitude: {longitude})  

⚠ **Disaster Type:** [Earthquake, Flood, Wildfire, Storm, Landslide, etc.]  
📊 **Severity Level:** [Low | Moderate | High | Critical]  
👥 **People Affected:** [Estimated number]  
🏚 **Infrastructure Damage:** [Brief description]  
🚨 **Issued Warnings:** [Tsunami warning, evacuation notice, etc.]  

📢 **URGENT RESPONSE REQUIRED**  
- [Brief advisory actions, e.g., "Seek higher ground immediately.", "Avoid coastal areas.", "Follow local authority updates."]  

🛑 **MAJOR ACTIONS TO TAKE:**  
1️⃣ **Personal Safety:** [E.g., "Take cover under sturdy furniture.", "Evacuate to safe zones.", "Avoid bridges and unstable buildings."]  
2️⃣ **Emergency Supplies:** [E.g., "Ensure you have water, food, and medical kits.", "Charge your mobile devices."]  
3️⃣ **Transportation & Travel:** [E.g., "Avoid unnecessary travel.", "Roads may be blocked or flooded."]  
4️⃣ **Communication:** [E.g., "Inform family and friends about your location.", "Use text messages instead of calls to save network bandwidth."]  
5️⃣ **Follow Official Updates:** [E.g., "Monitor government alerts and news sources.", "Obey evacuation orders."]  

🗞 **Source:** [USGS, GDACS, ReliefWeb, or other official sources]  

Stay safe and follow emergency protocols. More updates to follow.  
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      response_format: { type: "text" },
    });

    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>", //TODO: Change to a valid email
      to: [email],
      subject: "DISASTER ALERT",
      html: `<p>${completion.choices[0].message.content}</p>`, //TODO: Add the response from OpenAI
    });

    console.log(completion.choices[0].message.content, "here is the content bruv");
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 },
    );
  }
}
