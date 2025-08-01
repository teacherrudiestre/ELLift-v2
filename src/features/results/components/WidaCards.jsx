// src/features/results/components/WidaCards.jsx (Updated to use new components)
import React from 'react';
import { useResultsStore } from '../../../store';
import WidaCard from './WidaCard';
import DynamicWidaCard from './DynamicWidaCard';

const WidaCards = () => {
  const { dynamicDescriptors, widaDescriptors } = useResultsStore();

  return (
    <>
      {dynamicDescriptors && (
        <DynamicWidaCard data={dynamicDescriptors} />
      )}
      {widaDescriptors && (
        <WidaCard descriptors={widaDescriptors} />
      )}
    </>
  );
};

export default WidaCards;