// src/services/adaptation/adapters/IEPAdapter.js
export class IEPAdapter {
  constructor() {
    this.accommodationStrategies = {
      worksheetLength: {
        'Short': {
          targetTime: '5-10 minutes',
          itemCount: '3-5 items',
          strategy: 'Focus on essential concepts only'
        },
        'Medium': {
          targetTime: '15-25 minutes', 
          itemCount: '6-12 items',
          strategy: 'Balanced coverage with appropriate pacing'
        },
        'Long': {
          targetTime: '30+ minutes',
          itemCount: '13+ items', 
          strategy: 'Comprehensive coverage with extended practice'
        }
      }
    };
  }

  async buildInstructions(params) {
    const { worksheetLength, addStudentChecklist, useMultipleChoice } = params;
    
    let instructions = `\n\n**IEP ACCOMMODATION REQUIREMENTS:**\n`;
    
    if (worksheetLength && worksheetLength !== 'Medium') {
      const strategy = this.accommodationStrategies.worksheetLength[worksheetLength];
      instructions += `- **Worksheet Length**: Adjust content for "${worksheetLength}" timeframe (${strategy.targetTime}, approximately ${strategy.itemCount})\n`;
      instructions += `- **Strategy**: ${strategy.strategy}\n`;
    }
    
    if (addStudentChecklist) {
      instructions += `- **Student Checklist**: Add a "My Learning Checklist" section at the top with 4-6 specific steps that match the actual worksheet activities\n`;
    }
    
    if (useMultipleChoice) {
      instructions += `- **Multiple Choice Format**: Convert open-ended questions to multiple choice with 3-4 answer options where appropriate\n`;
      instructions += `- **Multiple Choice Guidelines**: Ensure one clearly correct answer, plausible distractors, avoid "all of the above" or "none of the above"\n`;
    }

    return instructions;
  }

  generateStudentChecklist(contentAnalysis, params) {
    const items = [];
    const { materialType, subject } = params;
    
    // Generate context-specific checklist items
    if (contentAnalysis.questionTypes.hasQuestions) {
      items.push(`Read all questions carefully before starting`);
      items.push(`Answer all ${contentAnalysis.questionTypes.totalQuestions} questions`);
    }
    
    if (contentAnalysis.contentType.primaryType === 'reading_comprehension') {
      items.push('Read the passage twice before answering questions');
      items.push('Highlight or underline key information');
    }
    
    if (contentAnalysis.mathematical.isMathematical) {
      items.push('Show your work for all problems');
      items.push('Check your answers');
    }
    
    // Add subject-specific items
    if (subject === 'Mathematics') {
      items.push('Use the correct units in your answers');
    } else if (subject === 'Science') {
      items.push('Use scientific vocabulary in your responses');
    }
    
    // Always end with completion check
    items.push('Review all my work before finishing');
    
    return items.slice(0, 6); // Limit to 6 items
  }
}