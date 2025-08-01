// src/services/adaptation/adapters/WidaAdapter.js
export class WidaAdapter {
  constructor() {
    this.proficiencyLevels = {
      'entering': {
        sentences: '3-5 words maximum, simple present tense',
        vocabulary: 'Basic everyday words with visual supports',
        structure: 'Single simple sentences only',
        support: 'Extensive visual supports, word banks, matching activities',
        assessment: 'Fill-in-blank, true/false, picture matching'
      },
      'emerging': {
        sentences: '6-10 words with simple connecting words',
        vocabulary: 'Familiar words with gradual academic introduction',
        structure: 'Present and simple past tense',
        support: 'Visual supports, sentence starters, guided examples',
        assessment: 'Multiple choice, yes/no, short responses with frames'
      },
      'developing': {
        sentences: 'Expanded sentences with multiple clauses',
        vocabulary: 'Academic vocabulary with context support',
        structure: 'Various tenses and transitions',
        support: 'Graphic organizers, sentence frames, models',
        assessment: 'Mixed formats with substantial scaffolding'
      },
      'expanding': {
        sentences: 'Complex sentences with sophisticated language',
        vocabulary: 'Technical vocabulary with minimal support',
        structure: 'Multiple tenses and complex structures',
        support: 'Text-based scaffolds, reasoning requirements',
        assessment: 'Analysis tasks with some scaffolding'
      },
      'bridging': {
        sentences: 'Grade-level academic language with strategic supports',
        vocabulary: 'Specialized and technical terms',
        structure: 'Sophisticated grammatical structures',
        support: 'Minimal scaffolding, focus on refinement',
        assessment: 'Extended responses with light support'
      },
      'reaching': {
        sentences: 'Full grade-level complexity',
        vocabulary: 'All specialized vocabulary without support',
        structure: 'Sophisticated academic register',
        support: 'No simplification needed',
        assessment: 'Grade-level expectations, full rigor'
      }
    };
  }

  async getAdaptations(proficiencyLevel) {
    const level = this.normalizeProficiencyLevel(proficiencyLevel);
    return this.proficiencyLevels[level] || this.proficiencyLevels['developing'];
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
    
    const normalized = level.toLowerCase().trim();
    return levelMap[normalized] || normalized;
  }

  generateCanDoStatements(proficiencyLevel, subject, contentType) {
    const level = this.normalizeProficiencyLevel(proficiencyLevel);
    const adaptations = this.proficiencyLevels[level];
    
    const baseStatements = {
      'entering': [
        `Students can identify key ${subject.toLowerCase()} vocabulary with visual supports`,
        `Students can match ${subject.toLowerCase()} terms to pictures or symbols`,
        `Students can complete simple ${contentType} activities with extensive guidance`
      ],
      'emerging': [
        `Students can use basic ${subject.toLowerCase()} vocabulary in simple sentences`,
        `Students can answer yes/no questions about ${subject.toLowerCase()} concepts`,
        `Students can complete ${contentType} with sentence frames and examples`
      ],
      'developing': [
        `Students can explain ${subject.toLowerCase()} concepts using academic vocabulary`,
        `Students can analyze ${contentType} with graphic organizers`,
        `Students can make connections between ${subject.toLowerCase()} ideas with support`
      ],
      'expanding': [
        `Students can synthesize ${subject.toLowerCase()} information from multiple sources`,
        `Students can evaluate ${contentType} using subject-specific criteria`,
        `Students can create original responses about ${subject.toLowerCase()} topics`
      ],
      'bridging': [
        `Students can critique and analyze complex ${subject.toLowerCase()} materials`,
        `Students can produce detailed explanations of ${subject.toLowerCase()} processes`,
        `Students can engage in academic discussions about ${subject.toLowerCase()} topics`
      ],
      'reaching': [
        `Students can demonstrate full command of ${subject.toLowerCase()} academic language`,
        `Students can create sophisticated analyses of ${subject.toLowerCase()} content`,
        `Students can mentor others in ${subject.toLowerCase()} understanding`
      ]
    };

    return baseStatements[level] || baseStatements['developing'];
  }
}