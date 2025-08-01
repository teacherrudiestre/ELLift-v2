// src/features/adaptation/components/BasicInfoForm.jsx
import React from 'react';
import { subjects, gradeLevels, proficiencyLevels } from '../../../utils/constants';
import FormField from '../../../components/forms/FormField';
import Select from '../../../components/ui/Select';

const BasicInfoForm = ({
  subject,
  gradeLevel,
  proficiencyLevel,
  learningObjectives,
  onSubjectChange,
  onGradeLevelChange,
  onProficiencyLevelChange,
  onLearningObjectivesChange,
  validation
}) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <FormField
          label="Subject"
          required
          error={!subject}
          errorMessage="(Required)"
        >
          <Select
            value={subject}
            onChange={onSubjectChange}
            placeholder="Select Subject"
            options={subjects.map(subj => ({ value: subj, label: subj }))}
          />
        </FormField>

        <FormField label="Grade Level">
          <Select
            value={gradeLevel}
            onChange={onGradeLevelChange}
            placeholder="Select Grade"
            options={gradeLevels.map(grade => ({ value: grade, label: grade }))}
          />
        </FormField>
      </div>

      <FormField
        label="Content Learning Objectives"
        description="What should students learn? (Optional)"
      >
        <textarea
          value={learningObjectives}
          onChange={(e) => onLearningObjectivesChange(e.target.value)}
          placeholder="e.g., Students will solve linear equations..."
          className="input-field h-20 resize-none custom-scrollbar"
        />
      </FormField>

      <FormField
        label="WIDA Proficiency Level"
        required
        error={!proficiencyLevel}
        errorMessage="(Required)"
        className="mb-6"
      >
        <Select
          value={proficiencyLevel}
          onChange={onProficiencyLevelChange}
          placeholder="Select Level"
          options={proficiencyLevels.map(level => ({ 
            value: level.value, 
            label: level.label 
          }))}
        />
      </FormField>
    </>
  );
};

export default BasicInfoForm;