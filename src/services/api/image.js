// src/services/api/image.js
import { apiRequest } from './base';

export const generateImageWithAPI = async (params) => {
  const {
    prompt,
    style = 'educational',
    size = '512x512',
    subject,
    proficiencyLevel
  } = params;

  // Enhance prompt with educational context
  const enhancedPrompt = `${prompt}, educational style suitable for ${proficiencyLevel} level students learning ${subject}, clear and simple visual elements, appropriate for classroom use`;

  try {
    const response = await apiRequest('/api/image', {
      method: 'POST',
      body: {
        prompt: enhancedPrompt,
        style,
        size,
        n: 1 // Number of images to generate
      }
    });

    return {
      imageUrl: response.imageUrl,
      prompt: enhancedPrompt,
      metadata: {
        style,
        size,
        subject,
        proficiencyLevel,
        generatedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    throw new Error(`Image generation failed: ${error.message}`);
  }
};

export const generateImagePrompts = (content, subject, proficiencyLevel) => {
  // Analyze content and generate appropriate image prompts
  const prompts = [];

  // Basic subject-based prompts
  if (content.toLowerCase().includes('math') || subject.toLowerCase().includes('math')) {
    prompts.push({
      title: 'Mathematical Concepts',
      prompt: `Simple, colorful diagram showing mathematical concepts from the lesson, with clear labels and visual representations suitable for ${proficiencyLevel} level students`,
      usage: 'Use to illustrate mathematical concepts visually'
    });
  }

  if (content.toLowerCase().includes('science') || subject.toLowerCase().includes('science')) {
    prompts.push({
      title: 'Scientific Illustration',
      prompt: `Educational scientific diagram with clear labels, bright colors, and simple visual elements showing the scientific concepts discussed, appropriate for ${proficiencyLevel} level English language learners`,
      usage: 'Use to support scientific vocabulary and concepts'
    });
  }

  // Reading comprehension images
  if (content.length > 500) {
    prompts.push({
      title: 'Story Illustration',
      prompt: `Colorful, engaging illustration depicting the main scene or concept from the reading passage, simple art style suitable for educational use with ${proficiencyLevel} level students`,
      usage: 'Use to support reading comprehension and engagement'
    });
  }

  // Vocabulary support images
  prompts.push({
    title: 'Vocabulary Support',
    prompt: `Visual vocabulary cards showing key terms from ${subject} lesson, with simple illustrations and clear, easy-to-read text for ${proficiencyLevel} level English language learners`,
    usage: 'Use to support vocabulary development and retention'
  });

  return prompts.length > 0 ? { imagePrompts: prompts } : null;
};
