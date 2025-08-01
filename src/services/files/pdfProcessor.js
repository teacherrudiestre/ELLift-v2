// src/services/files/pdfProcessor.js
export const extractTextFromPDF = async (file, setProcessingStep) => {
  try {
    setProcessingStep?.('Extracting text from PDF...');
    
    // Import the PDF extraction logic
    const { extractTextFromPDF: extractPDFText } = await import('./textExtractor');
    return await extractPDFText(file, setProcessingStep);
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new APIError('Failed to extract text from PDF', null, error);
  }
};
