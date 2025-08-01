// src/components/layout/TipsSection.jsx
import React from 'react';
import Card from '../ui/Card';

const TipsSection = () => {
  return (
    <div className="xl:col-span-3">
      <Card variant="yellow" className="mb-6">
        <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
          💡 Tips for Best Results
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          <div className="text-sm text-yellow-700 space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-bold text-yellow-800">📄 PDF uploads:</span>
              <span>Works best with text-based PDFs (not scanned images)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-yellow-800">🎯 Learning objectives:</span>
              <span>Be specific about what students should learn for better adaptation</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-yellow-800">📊 WIDA levels:</span>
              <span>Choose the level that best matches your students' current abilities</span>
            </div>
          </div>
          <div className="text-sm text-yellow-700 space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-bold text-yellow-800">🌍 Bilingual support:</span>
              <span>Optional translations help bridge language gaps</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-yellow-800">✏️ Edit text:</span>
              <span>You can modify extracted PDF text before adapting</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-yellow-800">🔍 Review output:</span>
              <span>Always check adapted content for accuracy and appropriateness</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TipsSection;