// src/services/wida/WidaDescriptors.js
import { ProficiencyLevels } from './ProficiencyLevels';

export class WidaDescriptors {
  constructor() {
    this.proficiencyLevels = new ProficiencyLevels();
    this.contentAreas = ['language_arts', 'mathematics', 'science', 'social_studies'];
    this.gradeLevelClusters = ['k_2', '3_5', '6_8', '9_12'];
  }

  getDescriptors(proficiencyLevel, subject, gradeLevel, domain = 'reading') {
    const level = this.proficiencyLevels.getLevel(proficiencyLevel);
    const characteristics = this.proficiencyLevels.getCharacteristics(level.code, domain);
    
    if (!characteristics) {
      return this.createFallbackDescriptors(proficiencyLevel, subject);
    }

    return {
      proficiencyLevel: level.label,
      subject,
      gradeLevel,
      domain,
      canDo: this.adaptCanDoStatements(characteristics.canDo, subject, gradeLevel),
      languageExpectations: this.generateLanguageExpectations(level.code, subject),
      assessmentTypes: this.getAppropriateAssessments(level.code, domain),
      supports: characteristics.with || [],
      examples: this.generateExamples(level.code, subject, domain)
    };
  }

  adaptCanDoStatements(baseStatements, subject, gradeLevel) {
    return baseStatements.map(statement => {
      // Customize statements for specific subjects
      const subjectAdaptations = {
        'Mathematics': statement.replace(/content/g, 'mathematical concepts')
                                .replace(/information/g, 'mathematical information'),
        'Science': statement.replace(/content/g, 'scientific concepts')
                           .replace(/information/g, 'scientific data'),
        'English Language Arts': statement.replace(/content/g, 'literary elements')
                                          .replace(/information/g, 'textual information'),
        'Social Studies': statement.replace(/content/g, 'historical/social concepts')
                                  .replace(/information/g, 'historical information')
      };

      return subjectAdaptations[subject] || statement;
    });
  }

  generateLanguageExpectations(levelCode, subject) {
    const baseExpectations = {
      entering: {
        vocabulary: 'Basic everyday words with visual supports',
        sentenceStructure: '1-3 word responses, formulaic expressions',
        grammarFocus: 'Present tense, simple nouns and verbs',
        discourseFocus: 'Single words, gestures, pointing'
      },
      emerging: {
        vocabulary: 'High-frequency and some academic vocabulary',
        sentenceStructure: 'Simple sentences with basic connecting words',
        grammarFocus: 'Present and past tense, basic sentence patterns',
        discourseFocus: 'Phrases and simple sentences'
      },
      developing: {
        vocabulary: 'Academic vocabulary with context support',
        sentenceStructure: 'Expanded sentences with multiple clauses',
        grammarFocus: 'Various tenses, compound sentences',
        discourseFocus: 'Connected sentences, paragraph-level discourse'
      },
      expanding: {
        vocabulary: 'Technical vocabulary with minimal support',
        sentenceStructure: 'Complex sentences with sophisticated connectors',
        grammarFocus: 'Complex grammar structures, nuanced tenses',
        discourseFocus: 'Multi-paragraph discourse, argumentation'
      },
      bridging: {
        vocabulary: 'Specialized academic and technical terms',
        sentenceStructure: 'Sophisticated sentence variety',
        grammarFocus: 'Advanced grammar, subtle distinctions',
        discourseFocus: 'Academic register, complex reasoning'
      },
      reaching: {
        vocabulary: 'Full range of academic vocabulary',
        sentenceStructure: 'Native-like sentence complexity',
        grammarFocus: 'Full grammatical control',
        discourseFocus: 'Sophisticated academic discourse'
      }
    };

    const expectations = baseExpectations[levelCode] || baseExpectations.developing;
    
    // Add subject-specific vocabulary expectations
    const subjectVocab = {
      'Mathematics': ' including mathematical terminology',
      'Science': ' including scientific terminology',
      'English Language Arts': ' including literary terms',
      'Social Studies': ' including social studies concepts'
    };

    if (subjectVocab[subject]) {
      expectations.vocabulary += subjectVocab[subject];
    }

    return expectations;
  }

  getAppropriateAssessments(levelCode, domain) {
    const assessmentMap = {
      entering: ['Picture identification', 'Matching', 'Yes/no responses', 'Physical response'],
      emerging: ['Multiple choice', 'Fill-in-blank', 'Short phrases', 'Sentence completion'],
      developing: ['Short answer', 'Graphic organizers', 'Guided writing', 'Structured discussion'],
      expanding: ['Extended response', 'Analysis tasks', 'Independent projects', 'Presentations'],
      bridging: ['Research projects', 'Essays', 'Debates', 'Critical analysis'],
      reaching: ['Sophisticated analysis', 'Independent research', 'Creative projects', 'Leadership roles']
    };

    return assessmentMap[levelCode] || assessmentMap.developing;
  }

  generateExamples(levelCode, subject, domain) {
    // This would generate specific examples based on level, subject, and domain
    const examples = [
      `Example ${domain} activity for ${levelCode} level in ${subject}`,
      `Sample assessment task appropriate for this proficiency level`,
      `Suggested scaffolding strategy for this level`
    ];

    return examples;
  }

  createFallbackDescriptors(proficiencyLevel, subject) {
    return {
      proficiencyLevel,
      subject,
      gradeLevel: 'General',
      canDo: [
        `Students can engage with ${subject} content at their language level`,
        `Students can demonstrate understanding using appropriate supports`,
        `Students can participate in ${subject} activities with scaffolding`
      ],
      languageExpectations: {
        vocabulary: 'Subject-appropriate vocabulary with support',
        sentenceStructure: 'Sentences appropriate for proficiency level',
        grammarFocus: 'Grammar structures matching language development',
        discourseFocus: 'Discourse patterns suitable for academic content'
      },
      assessmentTypes: ['Multiple formats', 'Scaffolded assessments', 'Performance-based tasks'],
      supports: ['Visual aids', 'Graphic organizers', 'Peer support', 'Modified language'],
      examples: [`General ${subject} activities`, 'Adapted assessments', 'Supported practice']
    };
  }
}
