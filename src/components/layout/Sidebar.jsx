// src/components/layout/Sidebar.jsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

const Sidebar = ({ 
  isOpen = false, 
  onToggle, 
  children,
  title = "Navigation"
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:shadow-none lg:z-auto
        w-64 lg:w-auto
      `}>
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            icon={ChevronLeft}
            aria-label="Close sidebar"
          />
        </div>
        
        <div className="p-4 overflow-y-auto h-full">
          {children}
        </div>
      </div>
      
      {/* Toggle button for desktop */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        icon={isOpen ? ChevronLeft : ChevronRight}
        className="fixed top-4 left-4 z-30 lg:hidden"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      />
    </>
  );
};

export default Sidebar;