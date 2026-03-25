import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, ScheduleBlock } from "../types";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({ apiKey: apiKey || "" });
};

export async function generateTimetable(profile: UserProfile): Promise<ScheduleBlock[]> {
  const ai = getAI();
  const prompt = `
    Generate a personalized study schedule for a ${profile.educationLevel} student.
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

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
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

  try {
    const blocks = JSON.parse(response.text);
    if (!Array.isArray(blocks)) return [];
    return blocks.map((b: any) => ({ ...b, completed: false }));
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return [];
  }
}

export async function getBuddyMessage(profile: UserProfile, mood: string, progressContext: string = ""): Promise<string> {
  const ai = getAI();
  const prompt = `
    You are "Ace", an AI Study Buddy for a student named ${profile.displayName}.
    The student is currently feeling: ${mood}.
    Current progress: ${profile.targetExams.join(", ")} preparation.
    ${progressContext}
    Give a short, motivational, and supportive message (max 2 sentences).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text || "Keep going! You're doing great.";
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
    Generate a 5-question multiple-choice quiz for a ${educationLevel} student on the subject: ${subject}${examContext}.
    Each question should have 4 options and a correct answer index (0-3).
    Return a list of objects with question, options (array), and correctAnswer (number).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER }
          },
          required: ["question", "options", "correctAnswer"]
        }
      }
    }
  });

  try {
    const quiz = JSON.parse(response.text);
    return Array.isArray(quiz) ? quiz : [];
  } catch (error) {
    console.error("Failed to parse AI quiz response:", error);
    return [];
  }
}
