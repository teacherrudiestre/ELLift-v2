// src/features/results/components/StudentWorksheet.jsx
import React, { useRef } from 'react';
import { BookOpen, ClipboardList, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useResultsStore, useUIStore } from '../../../store';
import { useExport } from '../hooks/useExport';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const StudentWorksheet = () => {
  const { studentWorksheet } = useResultsStore();
  const { isLoading } = useUIStore();
  const worksheetRef = useRef(null);
  const { copyContent } = useExport();

  const handleCopy = async () => {
    await copyContent(worksheetRef.current, 'Student Worksheet');
  };

  if (!studentWorksheet) return null;

  return (
    <Card variant="green" className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-header text-green-800 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Adapted Student Material
        </h2>
        <Button
          variant="primary"
          size="sm"
          onClick={handleCopy}
          disabled={isLoading}
          icon={ClipboardList}
          className="bg-green-600 hover:bg-green-700"
        >
          Copy Worksheet
        </Button>
      </div>
      <div 
        ref={worksheetRef} 
        className="bg-white p-6 rounded-md border border-green-200 h-96 overflow-y-auto custom-scrollbar prose max-w-full"
      >
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {studentWorksheet}
        </ReactMarkdown>
      </div>
    </Card>
  );
};

export default StudentWorksheet;