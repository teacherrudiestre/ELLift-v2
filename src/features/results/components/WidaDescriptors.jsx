// src/features/results/components/WidaDescriptors.jsx
import React from 'react';
import { Target, BookOpen, Users } from 'lucide-react';
import Card from '../../../components/ui/Card';

const WidaDescriptors = ({ descriptors, title = "WIDA Descriptors" }) => {
  if (!descriptors) return null;

  return (
    <Card variant="blue" className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-blue-800">{title}</h3>
      </div>

      {descriptors.title && (
        <div className="mb-4 p-3 bg-blue-100 rounded-lg">
          <h4 className="font-medium text-blue-900">{descriptors.title}</h4>
        </div>
      )}

      {descriptors.descriptors && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Learning Descriptors
            </span>
          </div>
          
          <ul className="space-y-2">
            {descriptors.descriptors.map((descriptor, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>{descriptor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {descriptors.supports && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              ELL Supports Provided
            </span>
          </div>
          
          <div className="text-sm text-blue-700">
            {typeof descriptors.supports === 'string' ? (
              <p>{descriptors.supports}</p>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {descriptors.supports.map((support, index) => (
                  <li key={index}>{support}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {descriptors.assessmentTypes && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <span className="text-sm font-medium text-blue-800">
            Assessment Types: 
          </span>
          <span className="text-sm text-blue-700 ml-1">
            {descriptors.assessmentTypes}
          </span>
        </div>
      )}
    </Card>
  );
};

export default WidaDescriptors;