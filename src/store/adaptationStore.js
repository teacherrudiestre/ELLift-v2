// src/store/adaptationStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useAdaptationStore = create()(
  devtools(
    (set, get) => ({
      // Form state
      inputMethod: 'text',
      materialType: '',
      subject: '',
      gradeLevel: '',
      originalMaterial: '',
      learningObjectives: '',
      proficiencyLevel: '',
      
      // Bilingual support state
      includeBilingualSupport: false,
      nativeLanguage: '',
      translateSummary: false,
      translateInstructions: false,
      listCognates: false,
      
      // IEP accommodation state
      worksheetLength: 'Medium',
      addStudentChecklist: false,
      useMultipleChoice: false,
      
      // File upload state
      uploadedFile: null,
      extractedText: '',
      
      // Computed values
      validationStatus: () => {
        const state = get();
        const missingFields = [];
        
        if (!state.originalMaterial.trim()) missingFields.push('Material Content');
        if (!state.materialType) missingFields.push('Material Type');
        if (!state.subject) missingFields.push('Subject');
        if (!state.proficiencyLevel) missingFields.push('WIDA Proficiency Level');
        if (state.includeBilingualSupport && !state.nativeLanguage) missingFields.push('Native Language');
        
        return {
          isValid: missingFields.length === 0,
          missingFields
        };
      },
      
      // Actions
      setInputMethod: (method) => set({ inputMethod: method }),
      setMaterialType: (type) => set({ materialType: type }),
      setSubject: (subject) => set({ subject }),
      setGradeLevel: (level) => set({ gradeLevel: level }),
      setOriginalMaterial: (material) => set({ originalMaterial: material }),
      setLearningObjectives: (objectives) => set({ learningObjectives: objectives }),
      setProficiencyLevel: (level) => set({ proficiencyLevel: level }),
      
      // Bilingual support actions
      setBilingualSupport: (enabled) => set((state) => ({
        includeBilingualSupport: enabled,
        nativeLanguage: enabled ? 'Spanish' : '',
        translateSummary: enabled ? state.translateSummary : false,
        translateInstructions: enabled ? state.translateInstructions : false,
        listCognates: enabled ? state.listCognates : false
      })),
      setNativeLanguage: (language) => set({ nativeLanguage: language }),
      setTranslateSummary: (translate) => set({ translateSummary: translate }),
      setTranslateInstructions: (translate) => set({ translateInstructions: translate }),
      setListCognates: (list) => set({ listCognates: list }),
      
      // IEP accommodation actions
      setWorksheetLength: (length) => set({ worksheetLength: length }),
      setAddStudentChecklist: (add) => set({ addStudentChecklist: add }),
      setUseMultipleChoice: (use) => set({ useMultipleChoice: use }),
      
      // File upload actions
      setUploadedFile: (file) => set({ uploadedFile: file }),
      setExtractedText: (text) => set({ extractedText: text }),
      removeFile: () => set((state) => ({
        uploadedFile: null,
        extractedText: '',
        originalMaterial: state.originalMaterial === state.extractedText ? '' : state.originalMaterial
      })),
      
      // Reset actions
      clearAll: () => set({
        originalMaterial: '',
        learningObjectives: '',
        materialType: '',
        subject: '',
        gradeLevel: '',
        proficiencyLevel: '',
        uploadedFile: null,
        extractedText: '',
        inputMethod: 'text',
        includeBilingualSupport: false,
        nativeLanguage: '',
        translateSummary: false,
        translateInstructions: false,
        listCognates: false,
        worksheetLength: 'Medium',
        addStudentChecklist: false,
        useMultipleChoice: false
      })
    }),
    { name: 'adaptation-store' }
  )
);