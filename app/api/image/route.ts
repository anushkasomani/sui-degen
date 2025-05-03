import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { HistoryItem, HistoryPart } from "@/lib/types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const MODEL_ID = "gemini-2.0-flash-exp-image-generation";

interface FormattedHistoryItem {
  role: "user" | "model";
  parts: Array<{
    text?: string;
    inlineData?: { data: string; mimeType: string };
  }>;
}

export async function POST(req: NextRequest) {
  try {
    const requestData = await req.json();
    const { prompt, image: inputImage, history, backstory } = requestData;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Step 1: Generate or enhance backstory
    let finalBackstory = backstory;
    let parts: any[] = [];

    if (!backstory || backstory.trim() === "") {
      parts = [{ text: `Create a fun, unique, and memorable backstory for this NFT pet based on the "${prompt}" (maximum number of lines 4-5). 
 The backstory should include:
- The pet’s name, type (e.g., parrot, dog, cat), and any interesting traits that make it stand out.
- A memorable friend, rival, or companion that has shaped the pet’s journey (e.g., a close animal friend, a human, or another mythical creature).
- A special talent, skill, or characteristic that is unique to the pet (e.g., the parrot can sing entire songs perfectly, or the dog can fetch any object from miles away).
- A significant event or challenge in the pet’s life that adds depth to its story (e.g., the pet had to overcome a fear, complete a journey, or achieve something that makes it rare and collectible).
- An ongoing or future quest that the pet can evolve with, allowing it to grow, learn, or unlock new traits over time. This should include the potential for the pet to develop new skills, form new bonds, or reach new milestones.
- Optional: Any unique requirements for the pet’s interaction or friendship, such as earning happiness points, completing tasks, or unlocking certain abilities.
Keep the backstory engaging, emotional, and distinctive so that this NFT pet feels like a valuable, one-of-a-kind companion, with room for future growth and evolution.`
 }];
    } else {
      parts = [{ text: `Enhance and expand upon the backstory: "${backstory}" provided by the user for this NFT pet. Add more personality, unique traits, and memorable details that make the pet stand out. Make sure to include:
- A connection with a companion, friend, or rival that shapes the pet’s journey.
- A special talent or skill that the pet possesses.
- A challenge or significant event that defines the pet’s past and contributes to its evolution.
- Potential for future growth or quests that the pet could unlock as its journey continues.
Ensure the backstory is rich and unique, giving this pet a sense of life and evolution over time.
(maximum number of lines 4-5)
` }];
    }

    if (inputImage) {
      const imageParts = inputImage.split(",");
      if (imageParts.length >= 2) {
        parts.push({
          inlineData: {
            data: imageParts[1],
            mimeType: inputImage.includes("image/png") ? "image/png" : "image/jpeg",
          },
        });
      }
    }

    const backstoryResponse = await ai.models.generateContent({
      model: MODEL_ID,
      contents: [{ role: "user", parts }],
      config: { temperature: 0.7 },
    });

    finalBackstory = backstoryResponse?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // Step 2: Generate a name for the NFT pet
    const nameResponse = await ai.models.generateContent({
      model: MODEL_ID,
      contents: [
        {
          role: "user",
          parts: [{ text: `Suggest one unique, creative, and memorable name for an NFT pet based on this backstory: "${finalBackstory}". 
            The name should be short (max 2 words), easy to pronounce, and reflect the pet's personality. Output only the name.`
 }],
        },
      ],
      config: { temperature: 0.7 },
    });

    const petName = nameResponse?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Unnamed Pet";

    // Step 3: Format history for the image generation prompt
    const formattedHistory: FormattedHistoryItem[] =
      history && history.length > 0
        ? history.map((item: HistoryItem) => ({
            role: item.role,
            parts: item.parts.map((part: HistoryPart) => {
              if (part.text) return { text: part.text };
              if (part.image && item.role === "user") {
                const imgParts = part.image.split(",");
                if (imgParts.length > 1) {
                  return {
                    inlineData: {
                      data: imgParts[1],
                      mimeType: part.image.includes("image/png") ? "image/png" : "image/jpeg",
                    },
                  };
                }
              }
              return { text: "" };
            }),
          }))
        : [];

    const messageParts: any[] = [{ text: `Backstory: ${finalBackstory}` }, { text: prompt }];
    if (inputImage) {
      const imageParts = inputImage.split(",");
      if (imageParts.length >= 2) {
        messageParts.push({
          inlineData: {
            data: imageParts[1],
            mimeType: inputImage.includes("image/png") ? "image/png" : "image/jpeg",
          },
        });
      }
    }

    formattedHistory.push({
      role: "user",
      parts: messageParts,
    });

    // Step 4: Generate image using Gemini Flash 2.0
    const generationResponse = await ai.models.generateContent({
      model: MODEL_ID,
      contents: formattedHistory,
      config: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        responseModalities: ["Text", "Image"],
      },
    });

    let imageData: string | null = null;
    let mimeType = "image/png";

    if (generationResponse?.candidates?.length > 0) {
      const parts = generationResponse.candidates[0].content?.parts || [];
      for (const part of parts) {
        if ("inlineData" in part && part.inlineData) {
          imageData = part.inlineData.data ?? null;
          mimeType = part.inlineData.mimeType || "image/png";
        }
      }
    }

    return NextResponse.json({
      image: imageData ? `data:${mimeType};base64,${imageData}` : null,
      backstory: finalBackstory,
      petName: petName,
    });
  } catch (error) {
    console.error("Error generating NFT pet:", error);
    return NextResponse.json(
      {
        error: "Failed to generate NFT pet",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
