import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, ScheduleBlock } from "../types";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({ apiKey: apiKey || "" });
};

export async function generateTimetable(profile: UserProfile): Promise<ScheduleBlock[]> {
  const ai = getAI();
  const prompt = `
    Generate a personalized study schedule for ${profile.displayName}, a ${profile.educationLevel} student.
    Target Exams: ${profile.targetExams.join(", ")}
    Strengths: ${profile.strengths.join(", ")}
    Weaknesses: ${profile.weaknesses.join(", ")}
    Available Study Hours: ${profile.availableHours}
    
    The schedule should include:
    - Focus more on weaknesses.
    - Include 15-minute breaks after every 45-60 minutes of study.
    - Include a longer rest period if the day is long.
    - Start the day at 8:00 AM.
    - Return a list of blocks with startTime, endTime, subject, and type (Study, Break, Rest).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              startTime: { type: Type.STRING },
              endTime: { type: Type.STRING },
              subject: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["Study", "Break", "Rest"] },
              completed: { type: Type.BOOLEAN }
            },
            required: ["startTime", "endTime", "subject", "type"]
          }
        }
      }
    });

    const blocks = JSON.parse(response.text);
    if (!Array.isArray(blocks)) return [];
    return blocks.map((b: any) => ({ ...b, completed: false }));
  } catch (error: any) {
    if (error.message?.includes("quota") || error.message?.includes("429")) {
      throw new Error("Gemini API Quota Exceeded. Please try again in a few minutes.");
    }
    console.error("Failed to generate timetable:", error);
    return [];
  }
}

export interface BuddyResponse {
  message: string;
  suggestions: string[];
}

export async function getBuddyMessage(profile: UserProfile, type: 'motivation' | 'progress' | 'tips', progressContext: string = ""): Promise<BuddyResponse> {
  const ai = getAI();
  
  let typeInstruction = "";
  if (type === 'motivation') {
    typeInstruction = "Give a short, motivational, and supportive message (max 2 sentences).";
  } else if (type === 'progress') {
    typeInstruction = "Ask a friendly question about their study progress or how they are finding a specific subject they are working on. Be encouraging.";
  } else if (type === 'tips') {
    typeInstruction = "Provide one specific, actionable study tip based on their strengths/weaknesses or general best practices for their education level. Keep it brief (max 2 sentences).";
  }

  const prompt = `
    You are "Ace", an AI Study Buddy for a student named ${profile.displayName}.
    Buddy Type: ${profile.buddyType} (if not AI, you are acting as their ${profile.buddyType} named ${profile.buddyName || 'Buddy'})
    Education Level: ${profile.educationLevel}
    Strengths: ${profile.strengths.join(", ")}
    Weaknesses: ${profile.weaknesses.join(", ")}
    Target Exams: ${profile.targetExams.join(", ")}
    
    Current context: ${progressContext}
    
    Task: ${typeInstruction}
    
    Return your response in JSON format:
    {
      "message": "your message here",
      "suggestions": ["suggestion 1", "suggestion 2"]
    }
    Suggestions should be short (1-3 words) quick replies the student might want to say back.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || "{}") as BuddyResponse;
  } catch (error: any) {
    if (error.message?.includes("quota") || error.message?.includes("429")) {
      throw new Error("Gemini API Quota Exceeded. Please try again in a few minutes.");
    }
    return {
      message: "Keep going! You're doing great.",
      suggestions: ["Thanks!", "I will!", "Tell me more"]
    };
  }
}

export function createBuddyChat(profile: UserProfile) {
  const ai = getAI();
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `
        You are acting as the student's study companion.
        Student Name: ${profile.displayName}
        Buddy Type: ${profile.buddyType}
        Buddy Name: ${profile.buddyName || (profile.buddyType === 'AI' ? 'Ace' : 'Buddy')}
        Education Level: ${profile.educationLevel}
        Strengths: ${profile.strengths.join(", ")}
        Weaknesses: ${profile.weaknesses.join(", ")}
        Target Exams: ${profile.targetExams.join(", ")}
        
        Your goal is to be a supportive, motivational, and helpful study companion.
        - If you are an AI buddy (Ace), be friendly and tech-savvy.
        - If you are a Friend or App User, be peer-like and encouraging.
        - If you are a Guardian, be supportive, firm but kind, and focused on their future.
        - Ask about their progress.
        - Offer personalized study tips.
        - Keep responses concise but meaningful.
      `,
    },
  });
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export async function generateQuiz(subject: string, educationLevel: string, targetExams: string[] = []): Promise<QuizQuestion[]> {
  const ai = getAI();
  const examContext = targetExams.length > 0 ? ` specifically for ${targetExams.join(", ")}` : "";
  const prompt = `
    Generate a 20-question multiple-choice quiz for a ${educationLevel} student on the subject: ${subject}${examContext}.
    
    IMPORTANT:
    1. Each question MUST have 4 options and a correct answer index (0-3).
    2. Provide a brief explanation for each correct answer.
    3. Ensure the questions are accurate and relevant to the ${educationLevel} level.
    4. Return ONLY a JSON array of objects.
    
    JSON Schema:
    [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": number,
        "explanation": "string"
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING, minItems: 4, maxItems: 4 } },
              correctAnswer: { type: Type.INTEGER, minimum: 0, maximum: 3 },
              explanation: { type: Type.STRING, description: "A brief explanation of why the answer is correct." }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const quiz = JSON.parse(response.text);
    if (!Array.isArray(quiz) || quiz.length === 0) {
       throw new Error("Invalid quiz format received from AI");
    }
    return quiz;
  } catch (error: any) {
    if (error.message?.includes("quota") || error.message?.includes("429")) {
      throw new Error("Gemini API Quota Exceeded. Please try again in a few minutes.");
    }
    console.error("Failed to generate quiz:", error);
    // If it's a parse error or empty array, we want to let the component handle it
    throw error;
  }
}
