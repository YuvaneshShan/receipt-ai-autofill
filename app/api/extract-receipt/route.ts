import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

type ReceiptData = {
  merchantName: string;
  date: string;
  totalAmount: string;
  currency: string;
};

function cleanJsonText(text: string) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!image || !(image instanceof File)) {
      return NextResponse.json(
        { error: "Receipt image is required." },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    const ai = new GoogleGenAI({
      apiKey,
    });

    const prompt = `
You are an AI receipt extraction assistant.

Extract these fields from the receipt image:
- merchantName
- date
- totalAmount
- currency

Rules:
1. Return only valid JSON.
2. Do not include markdown.
3. Do not include explanation.
4. If a field is missing, use an empty string.
5. Use this exact JSON structure:

{
  "merchantName": "",
  "date": "",
  "totalAmount": "",
  "currency": ""
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
            {
              inlineData: {
                mimeType: image.type || "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    const rawText = response.text ?? "";
    const cleanedText = cleanJsonText(rawText);

    let extractedData: ReceiptData;

    try {
      extractedData = JSON.parse(cleanedText);
    } catch {
      return NextResponse.json(
        {
          error: "AI response was not valid JSON.",
          rawResponse: rawText,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      merchantName: extractedData.merchantName || "",
      date: extractedData.date || "",
      totalAmount: extractedData.totalAmount || "",
      currency: extractedData.currency || "",
    });
  } catch (error) {
    console.error("Receipt extraction error:", error);

    return NextResponse.json(
      { error: "Failed to extract receipt data." },
      { status: 500 }
    );
  }
}