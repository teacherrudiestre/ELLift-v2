// src/features/results/hooks/useExport.js
import { useCallback } from 'react';
import { useUIStore } from '../../../store';
import { copyToClipboard } from '../../../services/export/clipboardUtils';

export const useExport = () => {
  const { setSuccessWithAutoClear, setError } = useUIStore();

  const copyContent = useCallback(async (element, contentName) => {
    try {
      const message = await copyToClipboard(element, contentName);
      setSuccessWithAutoClear(message);
    } catch (error) {
      console.error('Copy failed:', error);
      setError(error.message);
    }
  }, [setSuccessWithAutoClear, setError]);

  return { copyContent };
};