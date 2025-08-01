// src/services/wida/DescriptorGenerator.js
export class DescriptorGenerator {
  constructor() {
    this.templates = {
      listening: this.createListeningTemplates(),
      speaking: this.createSpeakingTemplates(),
      reading: this.createReadingTemplates(),
      writing: this.createWritingTemplates()
    };
  }

  async generateDynamicDescriptors(adaptedContent, params) {
    const { subject, proficiencyLevel, contentType, analysis } = params;
    
    const descriptors = {
      title: `${subject} - ${proficiencyLevel} Level Adaptation`,
      descriptors: this.generateCanDoStatements(subject, proficiencyLevel, contentType),
      contentSpecificSupports: this.identifyActualSupports(adaptedContent),
      languageObjectives: this.generateLanguageObjectives(subject, proficiencyLevel),
      vocabularySupports: this.extractVocabularyTerms(adaptedContent),
      scaffoldingStrategies: this.identifyScaffoldingStrategies(adaptedContent, proficiencyLevel),
      assessmentSuggestions: this.generateAssessmentSuggestions(contentType, proficiencyLevel),
      adaptationNotes: this.generateAdaptationNotes(analysis, proficiencyLevel)
    };

    return descriptors;
  }

  generateCanDoStatements(subject, proficiencyLevel, contentType) {
    const level = this.normalizeProficiencyLevel(proficiencyLevel);
    const baseStatements = this.getBaseStatements(level);
    
    // Customize for subject and content type
    return baseStatements.map(statement => 
      this.customizeStatement(statement, subject, contentType)
    );
  }

  getBaseStatements(level) {
    const statements = {
      'entering': [
        'Students can identify key vocabulary with visual supports',
        'Students can match terms to pictures or symbols',
        'Students can complete simple activities with extensive guidance',
        'Students can respond using single words or short phrases'
      ],
      'emerging': [
        'Students can use basic vocabulary in simple sentences',
        'Students can answer yes/no questions about concepts',
        'Students can complete activities with sentence frames',
        'Students can express ideas using familiar language patterns'
      ],
      'developing': [
        'Students can explain concepts using academic vocabulary',
        'Students can analyze content with graphic organizers',
        'Students can make connections between ideas with support',
        'Students can participate in structured discussions'
      ],
      'expanding': [
        'Students can synthesize information from multiple sources',
        'Students can evaluate content using specific criteria',
        'Students can create original responses about topics',
        'Students can engage in academic debates with support'
      ],
      'bridging': [
        'Students can critique and analyze complex materials',
        'Students can produce detailed explanations of processes',
        'Students can engage in academic discussions',
        'Students can create sophisticated written responses'
      ],
      'reaching': [
        'Students can demonstrate full command of academic language',
        'Students can create sophisticated analyses of content',
        'Students can mentor others in understanding',
        'Students can engage in complex reasoning tasks'
      ]
    };

    return statements[level] || statements['developing'];
  }

  customizeStatement(statement, subject, contentType) {
    const subjectMap = {
      'Mathematics': 'mathematical',
      'Science': 'scientific',
      'English Language Arts': 'literary',
      'Social Studies': 'social studies'
    };

    const contentMap = {
      'reading_comprehension': 'reading passages',
      'mathematics': 'mathematical problems',
      'worksheet': 'worksheet activities',
      'quiz': 'assessment questions'
    };

    let customized = statement
      .replace(/concepts?/g, `${subjectMap[subject] || subject.toLowerCase()} concepts`)
      .replace(/content/g, contentMap[contentType] || 'content')
      .replace(/topics?/g, `${subject.toLowerCase()} topics`);

    return customized;
  }

  identifyActualSupports(adaptedContent) {
    const supports = [];
    
    // Check for vocabulary highlighting
    if (/\*\*(.*?)\*\*/.test(adaptedContent)) {
      supports.push('Key vocabulary terms highlighted');
    }
    
    // Check for simplified sentence structure
    const avgSentenceLength = this.calculateAverageSentenceLength(adaptedContent);
    if (avgSentenceLength < 15) {
      supports.push('Simplified sentence structure');
    }
    
    // Check for numbered instructions
    if (/^\s*\d+\.\s+/.test(adaptedContent)) {
      supports.push('Step-by-step numbered instructions');
    }
    
    // Check for checkboxes
    if (/\[\s*\]/.test(adaptedContent)) {
      supports.push('Student checklist provided');
    }
    
    // Check for clear headings
    if (/^#+\s+|\*\*[^*]+\*\*\s*$/gm.test(adaptedContent)) {
      supports.push('Clear section organization');
    }
    
    // Check for definitions
    if (/^(.+):\s*(.+)$/gm.test(adaptedContent)) {
      supports.push('Vocabulary definitions provided');
    }

    return supports;
  }

  generateLanguageObjectives(subject, proficiencyLevel) {
    const level = this.normalizeProficiencyLevel(proficiencyLevel);
    
    const objectives = {
      'entering': [
        `Use basic ${subject.toLowerCase()} vocabulary with visual supports`,
        'Follow simple one-step instructions',
        'Identify key information using pictures and symbols'
      ],
      'emerging': [
        `Express ${subject.toLowerCase()} ideas using sentence frames`,
        'Ask and answer simple questions about content',
        'Use connecting words like "and," "but," "because"'
      ],
      'developing': [
        `Explain ${subject.toLowerCase()} concepts using academic vocabulary`,
        'Compare and contrast ideas with graphic organizers',
        'Use various sentence structures to express ideas'
      ],
      'expanding': [
        `Analyze ${subject.toLowerCase()} content using complex sentences`,
        'Support opinions with evidence from text',
        'Use transitional phrases to connect ideas'
      ],
      'bridging': [
        `Synthesize ${subject.toLowerCase()} information from multiple sources`,
        'Engage in academic discussions using precise language',
        'Create detailed written explanations'
      ],
      'reaching': [
        `Demonstrate sophisticated ${subject.toLowerCase()} discourse`,
        'Use nuanced language to express complex ideas',
        'Adapt language for different audiences and purposes'
      ]
    };

    return objectives[level] || objectives['developing'];
  }

  extractVocabularyTerms(adaptedContent) {
    const boldTerms = adaptedContent.match(/\*\*(.*?)\*\*/g) || [];
    return boldTerms
      .map(term => term.replace(/\*\*/g, ''))
      .filter((term, index, array) => array.indexOf(term) === index) // Remove duplicates
      .slice(0, 10); // Limit to top 10 terms
  }

  identifyScaffoldingStrategies(adaptedContent, proficiencyLevel) {
    const strategies = [];
    const level = this.normalizeProficiencyLevel(proficiencyLevel);
    
    // Level-specific strategies
    const levelStrategies = {
      'entering': ['Visual supports', 'Word banks', 'Picture cues'],
      'emerging': ['Sentence frames', 'Multiple choice options', 'Partner support'],
      'developing': ['Graphic organizers', 'Sentence starters', 'Vocabulary definitions'],
      'expanding': ['Text-based supports', 'Reasoning scaffolds', 'Discussion prompts'],
      'bridging': ['Minimal scaffolding', 'Independent work expectations'],
      'reaching': ['Grade-level expectations', 'Extension opportunities']
    };

    strategies.push(...levelStrategies[level] || levelStrategies['developing']);

    // Content-based strategies
    if (adaptedContent.includes('[ ]')) strategies.push('Student self-monitoring checklist');
    if (/\d+\.\s+/.test(adaptedContent)) strategies.push('Sequential step-by-step format');
    if (adaptedContent.includes('**')) strategies.push('Key vocabulary highlighting');

    return [...new Set(strategies)]; // Remove duplicates
  }

  generateAssessmentSuggestions(contentType, proficiencyLevel) {
    const level = this.normalizeProficiencyLevel(proficiencyLevel);
    
    const suggestions = [];
    
    // Formative assessments
    const formative = {
      'entering': { type: 'Formative', description: 'Picture matching or pointing to answers' },
      'emerging': { type: 'Formative', description: 'Yes/no questions or simple multiple choice' },
      'developing': { type: 'Formative', description: 'Exit ticket with sentence frames' },
      'expanding': { type: 'Formative', description: 'Quick write with vocabulary use' },
      'bridging': { type: 'Formative', description: 'Peer discussion with summary' },
      'reaching': { type: 'Formative', description: 'Self-reflection on learning goals' }
    };

    // Summative assessments
    const summative = {
      'entering': { type: 'Summative', description: 'Portfolio of completed work with visuals' },
      'emerging': { type: 'Summative', description: 'Modified quiz with picture supports' },
      'developing': { type: 'Summative', description: 'Project with graphic organizer template' },
      'expanding': { type: 'Summative', description: 'Written response with rubric' },
      'bridging': { type: 'Summative', description: 'Research project with peer review' },
      'reaching': { type: 'Summative', description: 'Independent analysis task' }
    };

    suggestions.push(formative[level] || formative['developing']);
    suggestions.push(summative[level] || summative['developing']);

    return suggestions;
  }

  generateAdaptationNotes(analysis, proficiencyLevel) {
    const notes = [];
    
    if (analysis?.complexity?.overall?.needsSimplification) {
      notes.push(`Content complexity reduced to match ${proficiencyLevel} language level`);
    }
    
    if (analysis?.structure?.contentType === 'reading_comprehension') {
      notes.push('Reading passage preserved in full with comprehension support added');
    }
    
    if (analysis?.mathematical?.isMathematical) {
      notes.push('Mathematical vocabulary highlighted and supported with visual representations');
    }
    
    notes.push(`Language structures adapted for ${proficiencyLevel} proficiency level`);
    notes.push('Assessment format modified to support English language learners');

    return notes;
  }

  calculateAverageSentenceLength(content) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const totalWords = sentences.reduce((sum, sentence) => sum + sentence.split(/\s+/).length, 0);
    return sentences.length > 0 ? totalWords / sentences.length : 0;
  }

  normalizeProficiencyLevel(level) {
    const levelMap = {
      'level 1': 'entering',
      'level 2': 'emerging',
      'level 3': 'developing',
      'level 4': 'expanding',
      'level 5': 'bridging',
      'level 6': 'reaching'
    };
    
    return levelMap[level.toLowerCase()] || level.toLowerCase();
  }

  createListeningTemplates() {
    return {
      // Listening-specific descriptor templates
    };
  }

  createSpeakingTemplates() {
    return {
      // Speaking-specific descriptor templates
    };
  }

  createReadingTemplates() {
    return {
      // Reading-specific descriptor templates
    };
  }

  createWritingTemplates() {
    return {
      // Writing-specific descriptor templates
    };
  }
}