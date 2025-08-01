// src/components/layout/Header.jsx
import React from 'react';

const Header = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">{title}</h1>
      {subtitle && (
        <p className="text-gray-600 mb-6">{subtitle}</p>
      )}
    </div>
  );
};