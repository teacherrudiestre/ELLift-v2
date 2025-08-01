// src/features/results/components/DynamicWidaCard.jsx
import React, { useState } from 'react';
import { Zap, BookOpen, Target, ChevronDown, ChevronUp, Lightbulb, Check } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const DynamicWidaCard = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded for dynamic content

  if (!data) return null;

  const {
    title,
    descriptors = [],
    contentSpecificSupports = [],
    languageObjectives = [],
    assessmentSuggestions = [],
    scaffoldingStrategies = [],
    vocabularySupports = [],
    adaptationNotes = []
  } = data;

  return (
    <Card variant="green" className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-green-800">Content-Specific WIDA Descriptors</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          icon={isExpanded ? ChevronUp : ChevronDown}
          className="text-green-600 hover:bg-green-100"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>

      {/* Title */}
      {title && (
        <div className="mb-4 p-3 bg-green-100 rounded-lg">
          <h4 className="font-medium text-green-900">{title}</h4>
          <p className="text-xs text-green-700 mt-1">
            Generated specifically for your adapted material
          </p>
        </div>
      )}

      {/* Main Descriptors */}
      {descriptors.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Learning Objectives for This Material
            </span>
          </div>
          <ul className="space-y-2">
            {descriptors.map((descriptor, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{descriptor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Language Objectives */}
      {isExpanded && languageObjectives.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Language Learning Objectives
            </span>
          </div>
          <div className="space-y-2">
            {languageObjectives.map((objective, index) => (
              <div key={index} className="p-2 bg-green-50 rounded text-sm text-green-700">
                {objective}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content-Specific Supports */}
      {contentSpecificSupports.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Supports Included in This Material
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {contentSpecificSupports.slice(0, isExpanded ? contentSpecificSupports.length : 4).map((support, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></span>
                <span>{support}</span>
              </div>
            ))}
          </div>
          {contentSpecificSupports.length > 4 && !isExpanded && (
            <p className="text-xs text-green-600 mt-2">
              +{contentSpecificSupports.length - 4} more supports
            </p>
          )}
        </div>
      )}

      {/* Vocabulary Supports */}
      {isExpanded && vocabularySupports.length > 0 && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <h4 className="text-sm font-medium text-green-800 mb-2">Vocabulary Supports</h4>
          <div className="flex flex-wrap gap-2">
            {vocabularySupports.map((vocab, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full"
              >
                {vocab}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Scaffolding Strategies */}
      {isExpanded && scaffoldingStrategies.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-green-800 mb-2">Scaffolding Strategies Used</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
            {scaffoldingStrategies.map((strategy, index) => (
              <li key={index}>{strategy}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Assessment Suggestions */}
      {isExpanded && assessmentSuggestions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-green-800 mb-2">Assessment Suggestions</h4>
          <div className="space-y-2">
            {assessmentSuggestions.map((suggestion, index) => (
              <div key={index} className="p-2 bg-green-50 rounded text-sm">
                <span className="font-medium text-green-800">
                  {suggestion.type && `${suggestion.type}: `}
                </span>
                <span className="text-green-700">
                  {suggestion.description || suggestion}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adaptation Notes */}
      {isExpanded && adaptationNotes.length > 0 && (
        <div className="pt-3 border-t border-green-200">
          <h4 className="text-sm font-medium text-green-800 mb-2">Adaptation Notes</h4>
          <div className="space-y-2">
            {adaptationNotes.map((note, index) => (
              <p key={index} className="text-sm text-green-700 italic">
                "{note}"
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Badge */}
      <div className="mt-4 flex items-center justify-between p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-green-600" />
          <span className="text-xs font-medium text-green-800">
            Dynamically Generated
          </span>
        </div>
        <span className="text-xs text-green-600">
          Based on your specific content
        </span>
      </div>
    </Card>
  );
};

export default DynamicWidaCard;
