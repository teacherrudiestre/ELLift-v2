// src/features/results/components/ExportActions.jsx
import React, { useState } from 'react';
import { Download, FileText, Image, Package } from 'lucide-react';
import { useResultsStore } from '../../../store';
import { useExport } from '../hooks/useExport';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

const ExportActions = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const { studentWorksheet, teacherGuide, hasResults } = useResultsStore();
  const { 
    exportToPDF, 
    exportToWord, 
    exportAll, 
    isExporting 
  } = useExport();

  const hasResultsValue = hasResults();

  if (!hasResultsValue) return null;

  const handleExportPDF = async (type) => {
    try {
      if (type === 'student') {
        await exportToPDF(studentWorksheet, 'Student Worksheet');
      } else if (type === 'teacher') {
        await exportToPDF(teacherGuide, "Teacher's Guide");
      } else if (type === 'both') {
        await exportAll();
      }
      setIsExportModalOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <h3 className="font-semibold text-gray-800">Export Options</h3>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsExportModalOpen(true)}
          icon={Download}
          disabled={isExporting}
        >
          Export Materials
        </Button>
      </div>

      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Materials"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose how you'd like to export your adapted materials:
          </p>

          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              onClick={() => handleExportPDF('student')}
              icon={FileText}
              disabled={isExporting || !studentWorksheet}
              className="justify-start p-4 h-auto"
            >
              <div className="text-left">
                <div className="font-medium">Student Worksheet</div>
                <div className="text-xs text-gray-500">
                  Export the adapted student material as PDF
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleExportPDF('teacher')}
              icon={FileText}
              disabled={isExporting || !teacherGuide}
              className="justify-start p-4 h-auto"
            >
              <div className="text-left">
                <div className="font-medium">Teacher's Guide</div>
                <div className="text-xs text-gray-500">
                  Export the teacher's guide as PDF
                </div>
              </div>
            </Button>

            <Button
              variant="primary"
              onClick={() => handleExportPDF('both')}
              icon={Package}
              disabled={isExporting}
              className="justify-start p-4 h-auto"
            >
              <div className="text-left">
                <div className="font-medium">Complete Package</div>
                <div className="text-xs text-white opacity-90">
                  Export both materials as a ZIP file
                </div>
              </div>
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              💡 Tip: The complete package includes both materials plus WIDA descriptors
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ExportActions;
