// src/components/layout/PageLayout.jsx
import React from 'react';

const PageLayout = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {children}
    </div>
  );
};

export default PageLayout;