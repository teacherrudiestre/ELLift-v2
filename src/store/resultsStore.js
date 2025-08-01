// src/store/resultsStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useResultsStore = create()(
  devtools(
    (set, get) => ({
      // Results state
      studentWorksheet: '',
      teacherGuide: '',
      widaDescriptors: null,
      dynamicDescriptors: null,
      imagePrompts: null,
      
      // Metadata
      generatedAt: null,
      adaptationParams: null,
      
      // Computed values
      hasResults: () => {
        const state = get();
        return Boolean(state.studentWorksheet || state.teacherGuide);
      },
      
      // Actions
      setResults: (results) => set({
        studentWorksheet: results.studentWorksheet || '',
        teacherGuide: results.teacherGuide || '',
        widaDescriptors: results.widaDescriptors || null,
        dynamicDescriptors: results.dynamicWidaDescriptors || null,
        imagePrompts: results.imagePrompts || null,
        generatedAt: new Date().toISOString(),
        adaptationParams: results.params || null
      }),
      
      setStudentWorksheet: (worksheet) => set({ studentWorksheet: worksheet }),
      setTeacherGuide: (guide) => set({ teacherGuide: guide }),
      setWidaDescriptors: (descriptors) => set({ widaDescriptors: descriptors }),
      setDynamicDescriptors: (descriptors) => set({ dynamicDescriptors: descriptors }),
      setImagePrompts: (prompts) => set({ imagePrompts: prompts }),
      
      clearResults: () => set({
        studentWorksheet: '',
        teacherGuide: '',
        widaDescriptors: null,
        dynamicDescriptors: null,
        imagePrompts: null,
        generatedAt: null,
        adaptationParams: null
      })
    }),
    { name: 'results-store' }
  )
);