import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT } from '../constants';

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '',
});

export const analyzeProperty = async (address: string, rentalAmount: number) => {
  if (!address || !rentalAmount) {
    throw new Error('Address and rental amount are required.');
  }

  const prompt = `
Please analyze the following property based on the system instructions provided:

Dirección de la propiedad: ${address}
Monto de arriendo (CLP): $${rentalAmount.toLocaleString('es-CL')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    if (response.text) {
      return response.text;
    } else {
      throw new Error('Failed to generate analysis.');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};
