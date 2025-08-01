// src/services/adaptation/widaAdapter.js
export const getUniversalProficiencyAdaptations = (proficiencyLevel) => {
  const level = proficiencyLevel.toLowerCase();
  
  const adaptations = {
    'entering': {
      sentences: '3-5 words maximum',
      vocabulary: 'Basic everyday words only',
      structure: 'Single simple sentences',
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
  
  const levelKey = ['level 1', 'level 2', 'level 3', 'level 4', 'level 5', 'level 6'].includes(level) 
    ? ['entering', 'emerging', 'developing', 'expanding', 'bridging', 'reaching'][parseInt(level.split(' ')[1]) - 1]
    : level;
    
  return adaptations[levelKey] || adaptations['developing'];
};
