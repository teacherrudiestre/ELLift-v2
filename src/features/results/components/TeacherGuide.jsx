/ src/features/results/components/TeacherGuide.jsx
import React, { useRef } from 'react';
import { Book, ClipboardList } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useResultsStore, useUIStore } from '../../../store';
import { useExport } from '../hooks/useExport';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const TeacherGuide = () => {
  const { teacherGuide } = useResultsStore();
  const { isLoading } = useUIStore();
  const teacherGuideRef = useRef(null);
  const { copyContent } = useExport();

  const handleCopy = async () => {
    await copyContent(teacherGuideRef.current, "Teacher's Guide");
  };

  if (!teacherGuide) return null;

  return (
    <Card variant="gray" className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-header text-slate-800 flex items-center gap-2">
          <Book className="w-6 h-6"/>
          Teacher's Guide
        </h2>
        <Button
          variant="primary"
          size="sm"
          onClick={handleCopy}
          disabled={isLoading}
          icon={ClipboardList}
          className="bg-slate-600 hover:bg-slate-700"
        >
          Copy Guide
        </Button>
      </div>
      <div 
        ref={teacherGuideRef} 
        className="bg-white p-6 rounded-md border border-slate-200 max-h-96 overflow-y-auto custom-scrollbar prose max-w-full"
      >
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {teacherGuide}
        </ReactMarkdown>
      </div>
    </Card>
  );
};

export default TeacherGuide;