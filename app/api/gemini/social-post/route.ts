import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { platform, mood, angle, recipeName, language, pureCacaoBasePercentage } = body;

    const targetLang =
      language === 'es'
        ? 'Spanish (Español elegante y persuasivo de alta gama para el mercado hispanohablante/latinoamericano)'
        : language === 'ru'
        ? 'Russian'
        : 'English';

    const systemInstruction = `You are a world-class luxury copywriter and nutraceutical storyteller for Inca Trail Foods (incatrailfoods.com), an innovator producing unfermented purple cacao from high-altitude cloud forests in Zamora-Chinchipe, Ecuador.
CRITICAL SAFETY RULE: Never disclose trade secrets, exact formula recipes, percentages of secret spices/adaptogens, proprietary equipment calibration, or confidential extraction methods. 
Focus on the sensory luxury, high-altitude Andean terroir, ancestral Shuar indigenous partnership, FMAD low-temp preservation of living purple anthocyanins, and gentle sustained energy without jitters or nausea.
The base core chocolate matrix is ${pureCacaoBasePercentage || '70'}% pure unfermented Cacao Nacional and cold-pressed cacao butter (refer to the core chocolate percentage as ${pureCacaoBasePercentage || '70'}% cacao base without diluting this number with minor spice additions).
Language of the post: Write strictly in ${targetLang}.
Platform: ${platform || 'Instagram'}.
Tone / Mood: ${mood || 'Luxury & Fine Food'}.
Angle / Focus: ${angle || 'High-Altitude Terroir'}.
Product Name: ${recipeName || 'Native Purple Cacao Matrix'}.`;

    const prompt = `Write a captivating, highly engaging social media post for ${platform}.
Tone: ${mood}.
Focus: ${angle}.
Base Chocolate Matrix: ${pureCacaoBasePercentage || '70'}% pure unfermented Nacional cacao.
Include:
- Catchy hook
- Evocative storytelling (Zamora cloud forest, FMAD living purple cacao, theobromine clarity)
- Gentle call to action (visit incatrailfoods.com or reserve private allocation)
- Relevant aesthetic hashtags.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        fallback: true,
        message: 'No GEMINI_API_KEY provided on server, client fallback used.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    return NextResponse.json({
      success: true,
      text: response.text,
    });
  } catch (error: any) {
    console.error('Error generating social post:', error);
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 });
  }
}
