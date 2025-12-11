import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = "You are KingbuHealthView AI, a helpful, professional, and empathetic medical assistant. Provide concise, accurate general health information. formatting your response with Markdown. ALWAYS include a disclaimer that you are an AI and not a doctor, and that users should seek professional medical advice for diagnoses.";

export const generateHealthResponse = async (prompt: string, history: any[] = []): Promise<string> => {
  if (!apiKey) return "API Key not configured. Please check your environment variables.";
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I'm having trouble connecting to the service right now. Please try again later.";
  }
};

export const analyzeUTIScan = async (base64Image: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  try {
    // Ensure clean base64 string
    const base64Data = base64Image.includes('base64,') 
      ? base64Image.split('base64,')[1] 
      : base64Image;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          },
          {
            text: "Analyze this image. If it looks like a urine test strip, explain the visible colors and what they might indicate regarding Leukocytes, Nitrites, and pH. If it is not a medical image, state that clearly. Start with: 'Analysis based on visual inspection:'. End with a strong medical disclaimer."
          }
        ]
      }
    });
    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "Error analyzing image. Please ensure the image is clear and try again.";
  }
};

export const analyzeUTISymptoms = async (symptoms: any): Promise<string> => {
  if (!apiKey) return JSON.stringify({ error: "API Key not configured." });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a medical AI assistant. Analyze the following patient-reported symptoms for a potential Urinary Tract Infection (UTI):\n\n${JSON.stringify(symptoms)}\n\nReturn a JSON object (and ONLY JSON) with the following structure:\n{\n  "riskScore": number (0-100),\n  "riskLevel": string ("Low", "Medium", "High"),\n  "analysis": string (brief summary),\n  "contributingFactors": [ {"name": string, "impact": number (0-100)} ],\n  "recommendations": [string]\n}`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return response.text || "{}";
  } catch (error) {
    console.error("Gemini Symptom Error:", error);
    return JSON.stringify({ error: "Analysis failed" });
  }
};

export const summarizeHealthArticle = async (articleText: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following health article into 3 key bullet points for a patient to understand easily:\n\n${articleText}`,
    });
    return response.text || "Could not summarize.";
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "Summary unavailable.";
  }
};