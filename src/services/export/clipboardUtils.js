// src/services/export/clipboardUtils.js
export const copyToClipboard = async (element, contentName) => {
  if (!element) {
    throw new Error(`${contentName} content not found`);
  }

  try {
    const htmlContent = element.innerHTML;
    const styles = `
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #1f2937; }
        h2 { font-size: 18px; font-weight: bold; font-style: italic; margin-top: 24px; margin-bottom: 12px; color: #374151; }
        h3 { font-size: 16px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; color: #4b5563; }
        p, li { font-size: 14px; line-height: 1.5; margin-bottom: 8px; }
        ul, ol { margin-left: 20px; }
        strong { font-weight: bold; }
        em { font-style: italic; }
      </style>
    `;
    const fullHtml = `<html><head>${styles}</head><body>${htmlContent}</body></html>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob })
    ]);
    
    return `${contentName} copied to clipboard with formatting!`;
  } catch (err) {
    // Fallback to plain text if HTML copy fails
    try {
      const textContent = element.textContent;
      await navigator.clipboard.writeText(textContent);
      return `${contentName} copied as plain text to clipboard!`;
    } catch (textErr) {
      throw new Error(`Failed to copy ${contentName}. Please try selecting and copying manually.`);
    }
  }
};