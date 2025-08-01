// src/services/wida/ProficiencyLevels.js
export class ProficiencyLevels {
  constructor() {
    this.levels = {
      1: { code: 'entering', label: 'Level 1 - Entering' },
      2: { code: 'emerging', label: 'Level 2 - Emerging' },
      3: { code: 'developing', label: 'Level 3 - Developing' },
      4: { code: 'expanding', label: 'Level 4 - Expanding' },
      5: { code: 'bridging', label: 'Level 5 - Bridging' },
      6: { code: 'reaching', label: 'Level 6 - Reaching' }
    };

    this.characteristics = this.initializeCharacteristics();
  }

  initializeCharacteristics() {
    return {
      entering: {
        listening: {
          canDo: [
            'Identify objects, figures, people from oral statements',
            'Follow one-step oral directions',
            'Match oral descriptions to visual representations'
          ],
          with: ['Visual supports', 'Gestures', 'Repetition', 'Slower speech rate']
        },
        speaking: {
          canDo: [
            'Name concrete objects',
            'Answer yes/no questions',
            'Repeat words and phrases'
          ],
          with: ['High frequency vocabulary', 'Visual supports', 'Formulaic expressions']
        },
        reading: {
          canDo: [
            'Match icons with words',
            'Identify letters and numbers',
            'Recognize environmental print'
          ],
          with: ['Illustrated text', 'Familiar topics', 'Environmental print']
        },
        writing: {
          canDo: [
            'Copy letters and words',
            'Write numbers and dates',
            'Complete graphic organizers'
          ],
          with: ['Native language supports', 'Picture dictionaries', 'Sentence frames']
        }
      },
      
      emerging: {
        listening: {
          canDo: [
            'Categorize content-related information',
            'Follow two-step oral directions',
            'Identify main ideas from oral discourse'
          ],
          with: ['Gestures and visual supports', 'Repetition', 'Clarification']
        },
        speaking: {
          canDo: [
            'Ask WH-questions',
            'Describe people, places, things',
            'Retell simple stories or events'
          ],
          with: ['Sentence frames', 'Word banks', 'Visual supports']
        },
        reading: {
          canDo: [
            'Find main ideas in illustrated text',
            'Identify facts and explicit information',
            'Match cause to effect'
          ],
          with: ['Illustrated text', 'Familiar content', 'Graphic organizers']
        },
        writing: {
          canDo: [
            'Complete sentences using word banks',
            'Produce simple sentences',
            'Fill in graphic organizers'
          ],
          with: ['Word/phrase banks', 'Sentence frames', 'Native language supports']
        }
      },

      developing: {
        listening: {
          canDo: [
            'Categorize examples from grade level content',
            'Sequence oral information',
            'Draw conclusions from oral discourse'
          ],
          with: ['Visual supports', 'Graphic organizers', 'Peer interaction']
        },
        speaking: {
          canDo: [
            'Ask for clarification',
            'Describe processes and procedures',
            'Share personal experiences'
          ],
          with: ['Sentence starters', 'Word banks', 'Think-pair-share']
        },
        reading: {
          canDo: [
            'Identify main ideas and some details',
            'Sequence events in stories',
            'Compare and contrast information'
          ],
          with: ['Graphic organizers', 'Illustrations', 'Peer support']
        },
        writing: {
          canDo: [
            'Produce simple paragraphs',
            'Write personal narratives',
            'Complete research templates'
          ],
          with: ['Graphic organizers', 'Sentence starters', 'Peer editing']
        }
      },

      expanding: {
        listening: {
          canDo: [
            'Interpret information from multiple sources',
            'Analyze content-based information',
            'Draw conclusions and make inferences'
          ],
          with: ['Occasional visual support', 'Peer interaction', 'Note-taking guides']
        },
        speaking: {
          canDo: [
            'Explain processes using technical vocabulary',
            'Present information to an audience',
            'Engage in academic discussions'
          ],
          with: ['Occasional prompting', 'Planning time', 'Visual aids']
        },
        reading: {
          canDo: [
            'Infer meaning from grade-level text',
            'Analyze and synthesize information',
            'Evaluate author\'s purpose'
          ],
          with: ['Some visual support', 'Graphic organizers', 'Discussion']
        },
        writing: {
          canDo: [
            'Produce expository text',
            'Write multi-paragraph essays',
            'Edit and revise writing'
          ],
          with: ['Graphic organizers', 'Models', 'Checklists']
        }
      },

      bridging: {
        listening: {
          canDo: [
            'Synthesize grade-level content',
            'Evaluate speaker\'s point of view',
            'Critique oral presentations'
          ],
          with: ['Minimal visual support', 'Note-taking strategies']
        },
        speaking: {
          canDo: [
            'Argue points of view',
            'Negotiate meaning in discussions',
            'Code-switch between registers'
          ],
          with: ['Minimal support', 'Planning time']
        },
        reading: {
          canDo: [
            'Evaluate complex grade-level text',
            'Synthesize information across texts',
            'Critique author\'s craft and purpose'
          ],
          with: ['Minimal support', 'Independent reading']
        },
        writing: {
          canDo: [
            'Produce grade-level writing',
            'Write for multiple purposes',
            'Use complex grammatical structures'
          ],
          with: ['Minimal support', 'Independent writing']
        }
      },

      reaching: {
        listening: {
          canDo: [
            'Understand implicit meaning',
            'Analyze abstract concepts',
            'Critique complex oral discourse'
          ],
          with: ['Specialized or technical language support as needed']
        },
        speaking: {
          canDo: [
            'Use precise academic language',
            'Present complex information',
            'Engage in sophisticated discourse'
          ],
          with: ['Occasional support for specialized terminology']
        },
        reading: {
          canDo: [
            'Analyze complex literary devices',
            'Synthesize multiple complex texts',
            'Evaluate nuanced arguments'
          ],
          with: ['Support for specialized content when needed']
        },
        writing: {
          canDo: [
            'Produce sophisticated academic writing',
            'Use complex rhetorical strategies',
            'Write for specialized audiences'
          ],
          with: ['Support for specialized writing genres when needed']
        }
      }
    };
  }

  getLevel(identifier) {
    // Handle numeric input
    if (typeof identifier === 'number') {
      return this.levels[identifier];
    }

    // Handle string input
    const lower = identifier.toLowerCase();
    
    // Check for "level X" format
    const levelMatch = lower.match(/level\s*(\d+)/);
    if (levelMatch) {
      return this.levels[parseInt(levelMatch[1])];
    }

    // Check for direct level names
    const levelByName = Object.values(this.levels).find(level => 
      level.code === lower || level.label.toLowerCase().includes(lower)
    );

    return levelByName || this.levels[3]; // Default to developing
  }

  getCharacteristics(level, domain = null) {
    const levelCode = typeof level === 'string' ? level : this.getLevel(level)?.code;
    const characteristics = this.characteristics[levelCode];
    
    if (!characteristics) return null;
    
    return domain ? characteristics[domain] : characteristics;
  }

  getAllLevels() {
    return this.levels;
  }

  getLevelProgression() {
    return Object.entries(this.levels).map(([number, level]) => ({
      number: parseInt(number),
      ...level,
      characteristics: this.characteristics[level.code]
    }));
  }
}