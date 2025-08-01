// src/components/ui/Card.jsx
import React from 'react';
import { clsx } from 'clsx';

const Card = ({
  children,
  variant = 'default',
  padding = 'default',
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-lg border shadow-sm';
  
  const variants = {
    default: 'bg-white border-gray-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    gray: 'bg-gray-50 border-gray-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200'
  };
  
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };
  
  const classes = clsx(
    baseClasses,
    variants[variant],
    paddings[padding],
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
