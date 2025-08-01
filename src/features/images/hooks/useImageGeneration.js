// src/features/images/hooks/useImageGeneration.js
import { useState } from 'react';
import { generateImageWithAPI } from '../../../services/api/image';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const generateImage = async (params) => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateImageWithAPI(params);
      setGeneratedImage(result.imageUrl);
      
      // Add to history
      const historyItem = {
        id: Date.now(),
        prompt: params.prompt,
        style: params.style,
        size: params.size,
        imageUrl: result.imageUrl,
        generatedAt: new Date().toISOString()
      };
      
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to generate image');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const removeFromHistory = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return {
    generateImage,
    isGenerating,
    generatedImage,
    error,
    history,
    clearHistory,
    removeFromHistory
  };
};