// src/features/adaptation/components/SettingsPanel.jsx
import React from 'react';
import { Settings, RotateCcw } from 'lucide-react';
import { useAdaptationStore, useUIStore } from '../../../store';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import FormSection from '../../../components/forms/FormSection';

const SettingsPanel = () => {
  const { clearAll } = useAdaptationStore();
  const { showImageFeatures, setShowImageFeatures } = useUIStore();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      clearAll();
    }
  };

  return (
    <Card variant="gray" className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-800">Settings</h3>
      </div>
      
      <FormSection title="Developer Options" variant="default">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Image Features</span>
            <button
              onClick={() => setShowImageFeatures(!showImageFeatures)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                showImageFeatures 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
            >
              {showImageFeatures ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </FormSection>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          icon={RotateCcw}
          className="w-full"
        >
          Reset All Settings
        </Button>
      </div>
    </Card>
  );
};

export default SettingsPanel;