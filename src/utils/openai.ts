import { DisasterReport } from "@/types";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const estimateFinancialAid = async (report: DisasterReport) => {
  const prompt = `
    Estimate the financial aid required for the following disaster:

    **Reporter Name:** ${report.name}
    **Disaster Type:** ${report.disasterType}
    **Severity:** ${report.severity}
    **Immediate Needs:** ${report.immediateNeeds}

   Provide the estimated amount in USD, and then provide the final amount, which must match the following regex: Total cost: \b\d{1,3}(?:,\d{3})*(?:\.\d{2})? USD\b
  `;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4",
  });

  const response = completion.choices[0].message.content;

  const amountMatch = response?.match(
    /Total cost:\s*\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})? USD[.,]*/,
  );
  const amount = amountMatch
    ? parseFloat(amountMatch[0].replace(/[^0-9.-]+/g, ""))
    : 0;

  return {
    amount,
    description: response,
  };
};

export const generateDescription = async ({
  disasterType,
  severity,
  immediateNeeds,
  username,
  number,
  location,
}: {
  disasterType: string;
  severity: string;
  immediateNeeds: string;
  username: string;
  number: string;
  location: { lat: number; lng: number };
}) => {
  try {
    const prompt = `Generate a detailed description for a disaster report with the following details:
- Disaster Type: ${disasterType}
- Severity: ${severity}
- Immediate Needs: ${immediateNeeds}
- Reported by: ${username} (${number})
- Location: Latitude ${location.lat}, Longitude ${location.lng}

The description should be concise yet detailed enough to help estimate financial aid.`;

    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    return data.result; // Return the generated description
  } catch (error) {
    console.error("Error generating description:", error);
    return null;
  }
};