// src/app/App.jsx - Updated main component
import React from 'react';
import { useUIStore, useResultsStore } from '../store';
import AppProviders from './providers/AppProviders';
import PageLayout from '../components/layout/PageLayout';
import AdaptationForm from '../features/adaptation/components/AdaptationForm';
import MaterialInput from '../features/adaptation/components/MaterialInput';
import ActionButtons from '../features/adaptation/components/ActionButtons';
import StatusIndicator from '../components/ui/StatusIndicator';
import StudentWorksheet from '../features/results/components/StudentWorksheet';
import TeacherGuide from '../features/results/components/TeacherGuide';
import WidaCards from '../features/results/components/WidaCards';
import ImageFeatures from '../features/images/components/ImageFeatures';
import TipsSection from '../components/layout/TipsSection';

const ELLMaterialAdapter = () => {
  const { 
    isLoading, 
    processingStep, 
    error, 
    successMessage, 
    showImageFeatures,
    setShowImageFeatures 
  } = useUIStore();
  
  const { hasResults } = useResultsStore();
  const hasResultsValue = hasResults();

  return (
    <AppProviders>
      <PageLayout>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">ELLift</h1>
          <p className="text-gray-600 mb-6">
            Transform your classroom materials to support English Language Learners
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Adaptation Form */}
          <div className="xl:col-span-1">
            <AdaptationForm />
            
            <StatusIndicator 
              processingStep={processingStep}
              error={error}
              success={successMessage}
            />
          </div>

          {/* Right Column - Material Input & Results */}
          <div className="xl:col-span-2 space-y-6">
            <MaterialInput />
            <ActionButtons />
            
            {hasResultsValue && (
              <div id="results-section" className="space-y-6">
                <StudentWorksheet />
                <TeacherGuide />
                <WidaCards />
              </div>
            )}
          </div>
        </div>

        <TipsSection />
        
        {/* Developer Toggle for Image Features */}
        <div className="xl:col-span-3">
          <div className="card bg-gray-50 border-gray-200 mb-4">
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-medium">🧪 Developer Mode: Image Features</span>
              <button
                onClick={() => setShowImageFeatures(!showImageFeatures)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  showImageFeatures 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}
              >
                {showImageFeatures ? 'Hide' : 'Show'} Image Features
              </button>
            </div>
          </div>
        </div>

        {showImageFeatures && <ImageFeatures />}
      </PageLayout>
    </AppProviders>
  );
};

export default ELLMaterialAdapter;