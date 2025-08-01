// src/app/providers/AppProviders.jsx
import React from 'react';
import ErrorBoundary from './ErrorBoundary';

const AppProviders = ({ children }) => {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

export default AppProviders;