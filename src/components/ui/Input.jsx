// src/components/ui/Input.jsx
import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

const Input = forwardRef(({
  type = 'text',
  placeholder,
  value,
  onChange,
  error = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors';
  
  const stateClasses = {
    normal: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
    error: 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500',
    disabled: 'bg-gray-50 text-gray-500 cursor-not-allowed'
  };
  
  const state = error ? 'error' : disabled ? 'disabled' : 'normal';
  
  const classes = clsx(
    baseClasses,
    stateClasses[state],
    className
  );

  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={classes}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
