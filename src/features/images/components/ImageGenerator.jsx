// src/features/images/components/ImageGenerator.jsx
import React, { useState } from 'react';
import { Palette, Download, Copy, Wand2 } from 'lucide-react';
import { useImageGeneration } from '../hooks/useImageGeneration';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const ImageGenerator = ({ subject, proficiencyLevel }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('educational');
  const [size, setSize] = useState('512x512');
  
  const { 
    generateImage, 
    isGenerating, 
    generatedImage, 
    error 
  } = useImageGeneration();

  const styleOptions = [
    { value: 'educational', label: 'Educational Illustration' },
    { value: 'cartoon', label: 'Cartoon Style' },
    { value: 'realistic', label: 'Realistic' },
    { value: 'simple', label: 'Simple Line Art' },
    { value: 'colorful', label: 'Colorful & Engaging' }
  ];

  const sizeOptions = [
    { value: '256x256', label: 'Small (256x256)' },
    { value: '512x512', label: 'Medium (512x512)' },
    { value: '1024x1024', label: 'Large (1024x1024)' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    await generateImage({
      prompt: prompt.trim(),
      style,
      size,
      subject,
      proficiencyLevel
    });
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      // Could show success message
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  const generateSamplePrompt = () => {
    const samplePrompts = [
      `A simple, colorful illustration showing ${subject} concepts suitable for ${proficiencyLevel} level students`,
      `Educational diagram explaining ${subject} in a clear, visual way for English language learners`,
      `Cartoon-style illustration of ${subject} with labeled parts and bright colors`,
      `Simple line drawing showing ${subject} concepts with clear visual elements`
    ];
    
    const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
    setPrompt(randomPrompt);
  };

  return (
    <Card variant="default" className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-800">AI Image Generator</h3>
      </div>

      <div className="space-y-4">
        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Description
          </label>
          <div className="flex gap-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={generateSamplePrompt}
              icon={Wand2}
              title="Generate sample prompt"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyPrompt}
              icon={Copy}
              disabled={!prompt}
              title="Copy prompt"
            />
          </div>
        </div>

        {/* Style and Size Options */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Style
            </label>
            <Select
              value={style}
              onChange={setStyle}
              options={styleOptions}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <Select
              value={size}
              onChange={setSize}
              options={sizeOptions}
            />
          </div>
        </div>

        {/* Generate Button */}
        <Button
          variant="primary"
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          isLoading={isGenerating}
          icon={Palette}
          className="w-full"
        >
          {isGenerating ? 'Generating Image...' : 'Generate Image'}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Generated Image */}
        {generatedImage && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Generated Image</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = generatedImage;
                  link.download = 'generated-image.png';
                  link.click();
                }}
                icon={Download}
              >
                Download
              </Button>
            </div>
            <img
              src={generatedImage}
              alt="Generated educational image"
              className="w-full rounded-lg border border-gray-200"
            />
          </div>
        )}

        {/* Tips */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-1">💡 Tips for better images:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Be specific about colors, style, and educational level</li>
            <li>• Include "for English language learners" in your prompt</li>
            <li>• Mention if you want labels, diagrams, or simple illustrations</li>
            <li>• Try different styles to see what works best for your students</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default ImageGenerator;
