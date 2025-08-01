// src/components/forms/FormSection.jsx
import React from 'react';
import { clsx } from 'clsx';

const FormSection = ({
  title,
  description,
  children,
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: 'bg-gray-50 border-gray-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200'
  };

  return (
    <div className={clsx(
      'p-4 rounded-lg border',
      variants[variant],
      className
    )}>
      {title && (
        <h3 className="text-sm font-medium text-gray-800 mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-xs text-gray-600 mb-3">{description}</p>
      )}
      {children}
    </div>
  );
};

export default FormSection;