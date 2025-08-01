// src/features/results/components/WidaCard.jsx
import React, { useState } from 'react';
import { Target, BookOpen, Users, ChevronDown, ChevronUp, Info } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const WidaCard = ({ descriptors }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!descriptors) return null;

  const {
    proficiencyLevel,
    subject,
    gradeLevel,
    canDo = [],
    languageExpectations = {},
    assessmentTypes = [],
    supports = [],
    examples = []
  } = descriptors;

  return (
    <Card variant="blue" className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-800">WIDA Performance Descriptors</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          icon={isExpanded ? ChevronUp : ChevronDown}
          className="text-blue-600 hover:bg-blue-100"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>

      {/* Level Info */}
      <div className="mb-4 p-3 bg-blue-100 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div>
            <span className="font-medium text-blue-900">Level:</span>
            <span className="ml-1 text-blue-800">{proficiencyLevel || 'Not specified'}</span>
          </div>
          <div>
            <span className="font-medium text-blue-900">Subject:</span>
            <span className="ml-1 text-blue-800">{subject || 'General'}</span>
          </div>
          <div>
            <span className="font-medium text-blue-900">Grade:</span>
            <span className="ml-1 text-blue-800">{gradeLevel || 'Not specified'}</span>
          </div>
        </div>
      </div>

      {/* Can-Do Descriptors */}
      {canDo.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Students Can Do
            </span>
          </div>
          <ul className="space-y-2">
            {canDo.slice(0, isExpanded ? canDo.length : 3).map((descriptor, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>{descriptor}</span>
              </li>
            ))}
          </ul>
          {canDo.length > 3 && !isExpanded && (
            <p className="text-xs text-blue-600 mt-2">
              +{canDo.length - 3} more descriptors (click expand to see all)
            </p>
          )}
        </div>
      )}

      {/* Language Expectations */}
      {isExpanded && Object.keys(languageExpectations).length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Language Expectations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {Object.entries(languageExpectations).map(([key, value]) => (
              <div key={key}>
                <span className="font-medium text-blue-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <p className="text-blue-600 mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assessment Types */}
      {isExpanded && assessmentTypes.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Appropriate Assessment Types</h4>
          <div className="flex flex-wrap gap-2">
            {assessmentTypes.map((type, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ELL Supports */}
      {supports.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Recommended ELL Supports
            </span>
          </div>
          <div className="text-sm text-blue-700">
            <ul className="list-disc list-inside space-y-1">
              {supports.slice(0, isExpanded ? supports.length : 2).map((support, index) => (
                <li key={index}>{support}</li>
              ))}
            </ul>
            {supports.length > 2 && !isExpanded && (
              <p className="text-xs text-blue-600 mt-2">
                +{supports.length - 2} more supports (click expand to see all)
              </p>
            )}
          </div>
        </div>
      )}

      {/* Examples */}
      {isExpanded && examples.length > 0 && (
        <div className="pt-3 border-t border-blue-200">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Examples</h4>
          <div className="space-y-2">
            {examples.map((example, index) => (
              <div key={index} className="p-2 bg-blue-50 rounded text-sm text-blue-700">
                {example}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="mt-4 p-2 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700">
            These descriptors are based on WIDA's English Language Development Standards 
            and are aligned with your selected proficiency level and subject area.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default WidaCard;
