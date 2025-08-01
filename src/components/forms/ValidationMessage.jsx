// src/components/forms/ValidationMessage.jsx
import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

const ValidationMessage = ({
  type = 'error',
  message,
  messages = [],
  className = ''
}) => {
  const types = {
    error: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      icon: AlertCircle
    },
    warning: {
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-200',
      icon: AlertTriangle
    },
    success: {
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
      icon: CheckCircle
    }
  };

  const config = types[type];
  const Icon = config.icon;
  const displayMessages = messages.length > 0 ? messages : [message].filter(Boolean);

  if (displayMessages.length === 0) return null;

  return (
    <div className={clsx(
      'p-3 rounded-md border',
      config.bgColor,
      config.borderColor,
      className
    )}>
      <div className="flex items-start gap-2">
        <Icon className={clsx('w-4 h-4 flex-shrink-0 mt-0.5', config.textColor)} />
        <div className={clsx('text-sm font-medium', config.textColor)}>
          {displayMessages.length === 1 ? (
            <span>{displayMessages[0]}</span>
          ) : (
            <ul className="list-disc list-inside space-y-1">
              {displayMessages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidationMessage;