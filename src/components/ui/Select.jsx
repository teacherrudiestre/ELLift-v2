/ src/components/ui/Select.jsx
import React from 'react';
import { clsx } from 'clsx';

const Select = ({
  value,
  onChange,
  placeholder,
  options = [],
  error = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors';
  
  const stateClasses = {
    normal: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white',
    error: 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-white',
    disabled: 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-300'
  };
  
  const state = error ? 'error' : disabled ? 'disabled' : 'normal';
  
  const classes = clsx(
    baseClasses,
    stateClasses[state],
    className
  );

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {placeholder && (
        <option value="">{placeholder}</option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
