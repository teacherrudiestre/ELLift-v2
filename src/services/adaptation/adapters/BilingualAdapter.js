// src/services/adaptation/adapters/BilingualAdapter.js
export class BilingualAdapter {
  constructor() {
    this.supportedLanguages = {
      'Spanish': { code: 'es', rtl: false },
      'French': { code: 'fr', rtl: false },
      'Arabic': { code: 'ar', rtl: true },
      'Chinese': { code: 'zh', rtl: false },
      'Vietnamese': { code: 'vi', rtl: false },
      'Portuguese': { code: 'pt', rtl: false },
      'Russian': { code: 'ru', rtl: false },
      'Korean': { code: 'ko', rtl: false },
      'Japanese': { code: 'ja', rtl: false },
      'German': { code: 'de', rtl: false }
    };
  }

  async buildInstructions(params) {
    const { nativeLanguage, translateSummary, translateInstructions, listCognates } = params;
    
    if (!nativeLanguage) return '';

    let instructions = `\n\n**BILINGUAL SUPPORT REQUIREMENTS (Native Language: ${nativeLanguage}):**\n`;
    
    // Vocabulary support (always included)
    instructions += `- For each term in the 'Key Vocabulary' section, provide translation in ${nativeLanguage}. Format: **term**: definition (*${nativeLanguage} translation*)\n`;
    
    if (translateSummary) {
      instructions += `- At the very top of the worksheet, provide a 1-2 sentence summary in ${nativeLanguage} explaining what students will learn.\n`;
    }
    
    if (translateInstructions) {
      instructions += `- For every 'Directions:' or instruction line, add the ${nativeLanguage} translation on the next line in italics.\n`;
    }
    
    if (listCognates) {
      instructions += `- In the teacher guide, create a 'Cognates to Highlight' section with English/${nativeLanguage} word pairs that share similar roots.\n`;
    }

    // Add language-specific considerations
    const langInfo = this.supportedLanguages[nativeLanguage];
    if (langInfo?.rtl) {
      instructions += `- Note: ${nativeLanguage} is a right-to-left language. Consider text direction in layout.\n`;
    }

    return instructions;
  }

  generateCognates(englishTerms, nativeLanguage) {
    // This would integrate with a cognate database
    // For now, return a simple structure
    const cognateMap = {
      'Spanish': {
        'animal': 'animal',
        'family': 'familia', 
        'natural': 'natural',
        'problem': 'problema',
        'information': 'información'
      },
      'French': {
        'animal': 'animal',
        'family': 'famille',
        'natural': 'naturel',
        'problem': 'problème',
        'information': 'information'
      }
    };

    const langCognates = cognateMap[nativeLanguage] || {};
    return englishTerms
      .filter(term => langCognates[term.toLowerCase()])
      .map(term => ({
        english: term,
        native: langCognates[term.toLowerCase()],
        similarity: 'high'
      }));
  }
}