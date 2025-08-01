// src/features/adaptation/components/IEPAccommodations.jsx
import React from 'react';
import FormSection from '../../../components/forms/FormSection';
import FormField from '../../../components/forms/FormField';
import Select from '../../../components/ui/Select';

const IEPAccommodations = ({
  worksheetLength,
  addStudentChecklist,
  useMultipleChoice,
  onWorksheetLengthChange,
  onAddStudentChecklistChange,
  onUseMultipleChoiceChange
}) => {
  const worksheetLengthOptions = [
    { value: 'Short', label: 'Short (5-10 min)' },
    { value: 'Medium', label: 'Medium (15-25 min)' },
    { value: 'Long', label: 'Long (30+ min)' }
  ];

  return (
    <FormSection 
      title="Additional Accommodations"
      variant="default"
      className="mb-6"
    >
      <div className="space-y-3">
        <FormField label="Worksheet Length">
          <Select
            value={worksheetLength}
            onChange={onWorksheetLengthChange}
            options={worksheetLengthOptions}
            className="text-sm"
          />
        </FormField>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="add-checklist" 
              checked={addStudentChecklist} 
              onChange={(e) => onAddStudentChecklistChange(e.target.checked)} 
              className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
            />
            <label htmlFor="add-checklist" className="text-sm text-gray-700">
              Add student checklist
            </label>
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="use-mcq" 
              checked={useMultipleChoice} 
              onChange={(e) => onUseMultipleChoiceChange(e.target.checked)} 
              className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
            />
            <label htmlFor="use-mcq" className="text-sm text-gray-700">
              Convert questions to multiple choice
            </label>
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default IEPAccommodations;