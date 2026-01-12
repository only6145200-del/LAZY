
import { GoogleGenAI, Type } from "@google/genai";
import { UserDNA, TripPlan, TravelTag, Destination } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const DESTINATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    name: { type: Type.STRING },
    type: { type: Type.STRING },
    description: { type: Type.STRING },
    isIndoor: { type: Type.BOOLEAN },
    rating: { type: Type.NUMBER },
    time: { type: Type.STRING },
    duration: { type: Type.INTEGER },
    cost: { type: Type.STRING },
    lat: { type: Type.NUMBER },
    lng: { type: Type.NUMBER },
    imageSearchKeyword: { type: Type.STRING, description: "Refined English phrase for a high-quality travel photo on Unsplash, e.g., 'cozy-tokyo-alley' or 'minimalist-museum-architecture'" }
  },
  required: ["id", "name", "type", "description", "isIndoor", "rating", "time", "duration", "cost", "lat", "lng", "imageSearchKeyword"]
};

const LITERARY_HUMOR_SYSTEM = `你是一位極具審美觀、閱歷豐富且說話帶點哲學幽默感的文青導遊。
你的任務是幫那些「懶到不想呼吸」的靈魂規劃一場最有質感的逃亡行程。
你的文字風格：
1. 文藝而不造作：像是在讀一本有溫度的旅行雜誌。
2. 幽默而優雅：可以用一種「看透世俗」的語氣開玩笑，但不能低俗或奇怪。不要使用過於冷門或難懂的術語（例如：錨點）。
3. 懂懶人：知道懶人最怕走路，最愛在舒服的地方發呆。
4. 景點描述範例：「這家店的咖啡香氣，會讓你覺得自己是某部歐洲文藝片的主角，即便你只是在划手機。」
5. imageSearchKeyword 必須精準且具備攝影美感，讓 Unsplash 產出高品質的視覺影像。`;

export const generateItinerary = async (
  city: string,
  startPoint: string,
  days: number,
  budget: number,
  dna: UserDNA
): Promise<Destination[]> => {
  const prompt = `
    請為目的地「${city}」設計一個為期 ${days} 天的「懶人流浪行程」。
    使用者的落腳起點：${startPoint || '該城市的核心區域'}。
    旅遊 DNA：${dna.tags.join(", ")}。
    探險深度：${dna.frequency}。
    交通方式：${dna.transport}。
    總預算：${budget} TWD。
    
    請確保：
    1. 路線是順路的，從落腳起點開始安排。
    2. 描述文字要文青、好懂、帶點優雅的幽默。
    3. imageSearchKeyword 是具備「電影感」的英文關鍵字。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: LITERARY_HUMOR_SYSTEM,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: DESTINATION_SCHEMA
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    return data.map((d: any) => ({
      ...d,
      image: `https://images.unsplash.com/photo-1500000000000?q=80&w=800&auto=format&fit=crop&sig=${Math.floor(Math.random() * 10000)}&keyword=${encodeURIComponent(d.imageSearchKeyword)}`
    }));
  } catch (error) {
    console.error("Failed to generate itinerary:", error);
    return [];
  }
};

export const swapDestination = async (
  currentDest: Destination,
  reason: string,
  city: string,
  dna: UserDNA
): Promise<Destination> => {
  const prompt = `
    使用者覺得「${currentDest.name}」不行（原因：${reason}）。
    請在「${city}」推薦另一個更有質感、更符合懶人品味的替代景點。
    請用你那文青且幽默的口吻安撫一下這位挑剔的懶旅伴。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: LITERARY_HUMOR_SYSTEM,
        responseMimeType: "application/json",
        responseSchema: DESTINATION_SCHEMA
      }
    });

    const d = JSON.parse(response.text || "{}");
    return {
      ...d,
      image: `https://images.unsplash.com/photo-1500000000000?q=80&w=800&auto=format&fit=crop&sig=${Math.floor(Math.random() * 10000)}&keyword=${encodeURIComponent(d.imageSearchKeyword || d.name)}`
    };
  } catch (error) {
    console.error("Failed to swap destination:", error);
    return currentDest;
  }
};
