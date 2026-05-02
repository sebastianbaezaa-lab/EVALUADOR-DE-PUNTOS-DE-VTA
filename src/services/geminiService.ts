import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT } from '../constants';

export const analyzeProperty = async (address: string, rentalAmount: number) => {
  if (!address || !rentalAmount) {
    throw new Error('Dirección y monto de arriendo son requeridos.');
  }

  // Obtenemos la API key en tiempo de ejecución (o build time en Vercel según la config de Vite)
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

  if (!apiKey || apiKey === 'undefined') {
    throw new Error('Falta la Gemini API Key. Para que funcione en Vercel, debes ir a "Settings" > "Environment Variables", añadir "GEMINI_API_KEY" con tu clave real, y hacer un nuevo despliegue (Redeploy).');
  }

  const ai = new GoogleGenAI({ apiKey });

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
      throw new Error('Error: no se pudo generar el análisis.');
    }
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    // Capturar el error específico de credenciales
    if (error.status === 401 || error.message?.includes('API key not valid')) {
      throw new Error('La API Key de Gemini configurada no es válida. Verifica la variable GEMINI_API_KEY en Vercel.');
    }
    throw error;
  }
};
