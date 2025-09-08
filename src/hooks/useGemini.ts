import { useState, useCallback } from 'react';
import { GeminiResponse } from '../types';
import { CustomizationData } from '../types';

export const useGemini = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = useCallback(async (prompt: string, inlineData?: string): Promise<{ generatedText: string | null; generatedImage: string | null; } | null> => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      const apiUrl = process.env.REACT_APP_GEMINI_API_URL;

      if (!apiKey || !apiUrl) {
        throw new Error('Gemini API configuration missing');
      }

      const fileData = inlineData ? {
        fileData: {
          fileUri: inlineData,
          mimeType: "image/png"
        }
      } : {};

      const promptContent = [{
            parts: [{
              text: prompt
            }, ...(inlineData ? [fileData] : [])],
          }];

      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: promptContent,
          generationConfig: {
            responseModalities: inlineData ? ['image'] : ['text'],
          },
        }),
      })

      if (!response.ok) {
        const { error: errorData } = await response.json();
        console.log('Gemini API Error Response:', errorData);
        throw new Error(`API Error: ${errorData.code} - ${errorData.message.split('.')[0] || 'Unknown error'}`);
      }

      const data: GeminiResponse = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
      const generatedImage = data.candidates[0].content.parts.find(part => part.inlineData && part.inlineData.mimeType.startsWith('image/'))?.inlineData?.data || null;

      return { generatedText, generatedImage };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate content';
      setError(errorMessage);
      console.error('Gemini API Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateSlogan = useCallback(async (productName: string, description: string): Promise<string | null> => {
    const prompt = `Create a single catchy, short slogan for a product called "${productName}" with description: "${description}". Keep it under 10 words and make it engaging for social media. Answer just the slogan as response`;
    return generateContent(prompt).then(result => result ? result.generatedText : null);
  }, [generateContent]);

  const generateContextForScene = useCallback(async (productName: string, description: string): Promise<string | null> => {
    const prompt = `Create 4 scripts for a scene to be used in a promotional image for a product called "${productName}" with description: "${description}". Each script should be a single sentence describing a visually appealing setting or scenario that highlights the product's features or usage. Avoid mentioning the product directly. Answer just the scripts as response, separated by semicolons.`;
    return generateContent(prompt).then(result => result ? result.generatedText : null);
  }, [generateContent]);

  const generateImagePostFromImage = useCallback(async (customizationData: CustomizationData): Promise<string | null> => {
    const prompt = `Create an image using the exact product from this image attached. 
    Keep the product fidelity to the original image do no change anything in the product package or label. 
    ${customizationData.focusOnProduct ? `The product should be in foregroung and in the ${customizationData.productPosition || "center"} of the image.` : ""}
    The product should occupy around ${customizationData.zoomLevel ? (customizationData.zoomLevel * 100).toFixed(0) : "70"}% of the image area.
    ${customizationData.mainColor ? "The most used color the scene should be " + customizationData.mainColor + " with a prominence of 20% over other colors." : ""}
    The context is: "${customizationData.context || "use your creativity based on the product slogan:" + customizationData.slogan}". 
    Make it visually appealing and relevant to the context. No text response, only image.`;

    const negativePrompt = `Do not include any text, watermarks, or logos in the image. Avoid using generic or unrelated backgrounds. Do not alter the product's appearance or packaging.`;
    
    return generateContent(`${prompt} ${negativePrompt}`, customizationData.imageUrl).then(result => result ? result.generatedImage : null);
  }, [generateContent]);

  return {
    loading,
    error,
    generateContent,
    generateSlogan,
    generateImagePostFromImage,
    generateContextForScene
  };
};
