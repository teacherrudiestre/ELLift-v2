// src/features/adaptation/components/MaterialTypeSelector.jsx
import React from 'react';
import { materialTypes } from '../../../utils/constants';

const MaterialTypeSelector = ({ materialType, onMaterialTypeChange }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Material Type *
        {!materialType && <span className="text-red-500 text-xs ml-1">(Required)</span>}
      </label>
      <div className="grid grid-cols-2 gap-3">
        {materialTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <button
              key={type.value}
              onClick={() => onMaterialTypeChange(type.value)}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                materialType === type.value
                  ? 'border-blue-500 bg-blue-100 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
              }`}
            >
              <IconComponent className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs font-medium">{type.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};