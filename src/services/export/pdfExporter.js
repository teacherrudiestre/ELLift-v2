// src/services/export/pdfExporter.js
export class PDFExporter {
  constructor() {
    this.isJsPDFLoaded = false;
  }

  async ensureJsPDFLoaded() {
    if (this.isJsPDFLoaded) return;

    // Dynamically import jsPDF
    try {
      const { jsPDF } = await import('jspdf');
      this.jsPDF = jsPDF;
      this.isJsPDFLoaded = true;
    } catch (error) {
      throw new Error('Failed to load PDF library. Please check your internet connection.');
    }
  }

  async exportToPDF(content, filename, options = {}) {
    await this.ensureJsPDFLoaded();

    const {
      format = 'a4',
      orientation = 'portrait',
      margins = { top: 20, left: 20, right: 20, bottom: 20 }
    } = options;

    try {
      const doc = new this.jsPDF({
        orientation,
        unit: 'mm',
        format
      });

      // Set font
      doc.setFont('helvetica');

      // Parse content and add to PDF
      this.addContentToPDF(doc, content, margins);

      // Save the PDF
      doc.save(`${filename}.pdf`);

      return { success: true, filename: `${filename}.pdf` };
    } catch (error) {
      throw new Error(`PDF export failed: ${error.message}`);
    }
  }

  addContentToPDF(doc, content, margins) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - margins.left - margins.right;
    
    let currentY = margins.top;
    const lineHeight = 6;

    // Simple text processing (you could enhance this with markdown parsing)
    const lines = content.split('\n');

    for (const line of lines) {
      if (!line.trim()) {
        currentY += lineHeight / 2;
        continue;
      }

      // Handle headers (simple detection)
      if (line.startsWith('#')) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        currentY += lineHeight;
      } else if (line.startsWith('**') && line.endsWith('**')) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
      }

      // Split long lines
      const textLines = doc.splitTextToSize(line.replace(/[#*]/g, ''), maxWidth);
      
      for (const textLine of textLines) {
        // Check if we need a new page
        if (currentY + lineHeight > pageHeight - margins.bottom) {
          doc.addPage();
          currentY = margins.top;
        }

        doc.text(textLine, margins.left, currentY);
        currentY += lineHeight;
      }

      currentY += 2; // Small gap between paragraphs
    }
  }

  async exportMultipleToPDF(contents, filename) {
    await this.ensureJsPDFLoaded();

    try {
      const doc = new this.jsPDF();

      for (let i = 0; i < contents.length; i++) {
        if (i > 0) doc.addPage();
        
        // Add title page for each section
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(contents[i].title, 20, 30);
        
        // Add content
        this.addContentToPDF(doc, contents[i].content, { top: 50, left: 20, right: 20, bottom: 20 });
      }

      doc.save(`${filename}.pdf`);
      return { success: true, filename: `${filename}.pdf` };
    } catch (error) {
      throw new Error(`Multi-PDF export failed: ${error.message}`);
    }
  }
}

export const pdfExporter = new PDFExporter();