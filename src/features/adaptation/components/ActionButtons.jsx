// src/features/adaptation/components/ActionButtons.jsx
import React from 'react';
import { Target, XCircle } from 'lucide-react';
import { useAdaptationStore, useResultsStore, useUIStore } from '../../../store';
import { useAdaptation } from '../hooks/useAdaptation';
import Button from '../../../components/ui/Button';
import ValidationMessage from '../../../components/forms/ValidationMessage';

const ActionButtons = () => {
  const { validationStatus } = useAdaptationStore();
  const { hasResults } = useResultsStore();
  const { isLoading } = useUIStore();
  const { adaptMaterial, clearAll } = useAdaptation();

  const validation = validationStatus();
  const hasResultsValue = hasResults();

  return (
    <div className="space-y-4">
      {!validation.isValid && validation.missingFields.length > 0 && (
        <ValidationMessage
          type="warning"
          message={`Missing required fields: ${validation.missingFields.join(', ')}`}
        />
      )}
      
      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          onClick={adaptMaterial}
          disabled={isLoading || !validation.isValid}
          isLoading={isLoading}
          icon={Target}
          className="w-full"
        >
          {hasResultsValue ? 'Re-Adapt Material' : 'Adapt Material'}
        </Button>
        
        <Button
          variant="danger"
          size="md"
          onClick={clearAll}
          disabled={isLoading}
          icon={XCircle}
          className="w-full"
        >
          Clear All Fields
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;