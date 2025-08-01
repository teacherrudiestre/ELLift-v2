// src/services/adaptation/adapters/SubjectAdapter.js
export class SubjectAdapter {
  constructor() {
    this.subjectStrategies = {
      'Mathematics': {
        vocabularyFocus: ['equation', 'variable', 'solution', 'graph', 'function'],
        visualSupports: ['number lines', 'graphs', 'diagrams', 'manipulatives'],
        scaffolding: ['step-by-step procedures', 'formula sheets', 'example problems'],
        assessmentTypes: ['problem solving', 'multiple choice', 'short answer']
      },
      'Science': {
        vocabularyFocus: ['hypothesis', 'observation', 'experiment', 'conclusion', 'data'],
        visualSupports: ['diagrams', 'charts', 'lab images', 'process flows'],
        scaffolding: ['graphic organizers', 'sentence frames', 'vocabulary banks'],
        assessmentTypes: ['investigation', 'explanation', 'analysis']
      },
      'English Language Arts': {
        vocabularyFocus: ['character', 'setting', 'plot', 'theme', 'evidence'],
        visualSupports: ['story maps', 'character charts', 'timeline'],
        scaffolding: ['sentence starters', 'paragraph frames', 'text structures'],
        assessmentTypes: ['written response', 'analysis', 'creative writing']
      },
      'Social Studies': {
        vocabularyFocus: ['culture', 'government', 'economy', 'geography', 'history'],
        visualSupports: ['maps', 'timelines', 'charts', 'primary sources'],
        scaffolding: ['cause and effect frames', 'comparison charts', 'vocabulary maps'],
        assessmentTypes: ['analysis', 'comparison', 'explanation']
      }
    };
  }

  async getSubjectAdaptations(subject, contentAnalysis) {
    const strategy = this.subjectStrategies[subject] || this.getGenericStrategy();
    
    return {
      subject,
      vocabularyFocus: strategy.vocabularyFocus,
      visualSupports: this.selectAppropriateSupports(strategy.visualSupports, contentAnalysis),
      scaffolding: strategy.scaffolding,
      assessmentTypes: strategy.assessmentTypes,
      specificInstructions: this.generateSubjectInstructions(subject, contentAnalysis)
    };
  }

  selectAppropriateSupports(supports, contentAnalysis) {
    // Select supports based on content type
    if (contentAnalysis.mathematical.isMathematical) {
      return supports.filter(s => ['graphs', 'diagrams', 'number lines'].includes(s));
    }
    if (contentAnalysis.contentType.primaryType === 'reading_comprehension') {
      return supports.filter(s => ['story maps', 'character charts', 'graphic organizers'].includes(s));
    }
    return supports.slice(0, 3); // Default to first 3
  }

  generateSubjectInstructions(subject, contentAnalysis) {
    const instructions = [];
    
    switch (subject) {
      case 'Mathematics':
        instructions.push('Include step-by-step problem-solving procedures');
        instructions.push('Provide formula reference when appropriate');
        if (contentAnalysis.mathematical.elements.measurements > 0) {
          instructions.push('Include unit conversion support');
        }
        break;
        
      case 'Science':
        instructions.push('Define scientific terms in context');
        instructions.push('Include cause-and-effect relationships');
        instructions.push('Connect to real-world examples');
        break;
        
      case 'English Language Arts':
        instructions.push('Provide text evidence examples');
        instructions.push('Include character motivation support');
        instructions.push('Add literary device explanations');
        break;
        
      case 'Social Studies':
        instructions.push('Provide historical context');
        instructions.push('Include geographic references');
        instructions.push('Connect to modern examples');
        break;
    }
    
    return instructions;
  }

  getGenericStrategy() {
    return {
      vocabularyFocus: ['key terms', 'academic vocabulary'],
      visualSupports: ['graphic organizers', 'charts', 'diagrams'],
      scaffolding: ['sentence frames', 'vocabulary support', 'examples'],
      assessmentTypes: ['multiple choice', 'short answer', 'matching']
    };
  }
}