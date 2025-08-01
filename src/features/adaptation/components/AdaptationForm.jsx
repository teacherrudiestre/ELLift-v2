// src/features/adaptation/components/AdaptationForm.jsx
import React from 'react';
import { useAdaptationStore } from '../../../store';
import MaterialTypeSelector from './MaterialTypeSelector';
import BasicInfoForm from './BasicInfoForm';
import BilingualSupport from './BilingualSupport';
import IEPAccommodations from './IEPAccommodations';

const AdaptationForm = () => {
  const {
    materialType,
    subject,
    gradeLevel,
    proficiencyLevel,
    learningObjectives,
    includeBilingualSupport,
    nativeLanguage,
    translateSummary,
    translateInstructions,
    listCognates,
    worksheetLength,
    addStudentChecklist,
    useMultipleChoice,
    validationStatus,
    // Actions
    setMaterialType,
    setSubject,
    setGradeLevel,
    setProficiencyLevel,
    setLearningObjectives,
    setBilingualSupport,
    setNativeLanguage,
    setTranslateSummary,
    setTranslateInstructions,
    setListCognates,
    setWorksheetLength,
    setAddStudentChecklist,
    setUseMultipleChoice
  } = useAdaptationStore();

  const validation = validationStatus();

  return (
    <div className="card bg-blue-50 border-blue-200 sticky top-6">
      <h2 className="section-header text-blue-800">ELL Adaptation Settings</h2>
      
      <MaterialTypeSelector 
        materialType={materialType}
        onMaterialTypeChange={setMaterialType}
      />
      
      <BasicInfoForm
        subject={subject}
        gradeLevel={gradeLevel}
        proficiencyLevel={proficiencyLevel}
        learningObjectives={learningObjectives}
        onSubjectChange={setSubject}
        onGradeLevelChange={setGradeLevel}
        onProficiencyLevelChange={setProficiencyLevel}
        onLearningObjectivesChange={setLearningObjectives}
        validation={validation}
      />
      
      <BilingualSupport
        includeBilingualSupport={includeBilingualSupport}
        nativeLanguage={nativeLanguage}
        translateSummary={translateSummary}
        translateInstructions={translateInstructions}
        listCognates={listCognates}
        onBilingualSupportChange={setBilingualSupport}
        onNativeLanguageChange={setNativeLanguage}
        onTranslateSummaryChange={setTranslateSummary}
        onTranslateInstructionsChange={setTranslateInstructions}
        onListCognatesChange={setListCognates}
      />
      
      <IEPAccommodations
        worksheetLength={worksheetLength}
        addStudentChecklist={addStudentChecklist}
        useMultipleChoice={useMultipleChoice}
        onWorksheetLengthChange={setWorksheetLength}
        onAddStudentChecklistChange={setAddStudentChecklist}
        onUseMultipleChoiceChange={setUseMultipleChoice}
      />
    </div>
  );
};

export default AdaptationForm;