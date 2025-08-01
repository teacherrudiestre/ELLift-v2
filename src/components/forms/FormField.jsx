// src/components/forms/FormField.jsx
import React from 'react';
import { clsx } from 'clsx';

const FormField = ({
  label,
  description,
  required = false,
  error = false,
  errorMessage,
  children,
  className = ''
}) => {
  return (
    <div className={clsx('mb-4', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {error && errorMessage && (
            <span className="text-red-500 text-xs ml-1">{errorMessage}</span>
          )}
          {description && (
            <span className="text-xs text-gray-500 block mt-1">{description}</span>
          )}
        </label>
      )}
      {children}
    </div>
  );
};

export default FormField;
