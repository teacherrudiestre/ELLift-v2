// src/utils/constants/widaConstants.js
export const widaConstants = {
  PROFICIENCY_LEVELS: {
    ENTERING: {
      code: 'entering',
      number: 1,
      label: 'Level 1 - Entering',
      description: 'Students have little or no understanding of English'
    },
    EMERGING: {
      code: 'emerging',
      number: 2,
      label: 'Level 2 - Emerging', 
      description: 'Students have limited understanding of English'
    },
    DEVELOPING: {
      code: 'developing',
      number: 3,
      label: 'Level 3 - Developing',
      description: 'Students understand more complex speech but still need support'
    },
    EXPANDING: {
      code: 'expanding',
      number: 4,
      label: 'Level 4 - Expanding',
      description: 'Students have good command of English with some gaps'
    },
    BRIDGING: {
      code: 'bridging',
      number: 5,
      label: 'Level 5 - Bridging',
      description: 'Students can express themselves fluently and spontaneously'
    },
    REACHING: {
      code: 'reaching',
      number: 6,
      label: 'Level 6 - Reaching',
      description: 'Students have developed the level of English proficiency comparable to native speakers'
    }
  },

  LANGUAGE_DOMAINS: {
    LISTENING: 'listening',
    SPEAKING: 'speaking', 
    READING: 'reading',
    WRITING: 'writing'
  },

  CONTENT_AREAS: {
    LANGUAGE_ARTS: 'language_arts',
    MATHEMATICS: 'mathematics',
    SCIENCE: 'science',
    SOCIAL_STUDIES: 'social_studies'
  },

  GRADE_LEVEL_CLUSTERS: {
    K_2: 'grades_k_2',
    THREE_FIVE: 'grades_3_5',
    SIX_EIGHT: 'grades_6_8',
    NINE_TWELVE: 'grades_9_12'
  }
};