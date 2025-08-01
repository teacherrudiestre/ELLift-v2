// src/components/ui/Button.jsx
import React from 'react';
import { clsx } from 'clsx';
import LoadingSpinner from './LoadingSpinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-md',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md',
    outline: 'border-2 border-gray-300 text-gray-700 bg-white hover:border-gray-400 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const classes = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={classes}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
      {!isLoading && Icon && iconPosition === 'left' && (
        <Icon className={clsx('flex-shrink-0', children ? 'mr-2' : '', size === 'sm' ? 'w-4 h-4' : 'w-5 h-5')} />
      )}
      {children}
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className={clsx('flex-shrink-0', children ? 'ml-2' : '', size === 'sm' ? 'w-4 h-4' : 'w-5 h-5')} />
      )}
    </button>
  );
};

export default Button;