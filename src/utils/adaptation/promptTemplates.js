// src/utils/adaptation/promptTemplates.js
export const promptTemplates = {
  
  // Main adaptation template
  adaptation: {
    build: (params) => {
      const { content, widaAdaptations, bilingualInstructions, iepInstructions, analysis } = params;
      
      return `You are an expert ELL curriculum adapter. Create a complete adapted worksheet for ${params.proficiencyLevel} level students.

**CONTENT ANALYSIS:**
- Content Type: ${analysis.structure.contentType}
- Complexity Level: ${analysis.complexity.overall.level}
- Word Count: ${analysis.metadata.wordCount}
- Processing Strategy: ${analysis.complexity.overall.processingStrategy}

**PROFICIENCY LEVEL ADAPTATIONS:**
- Sentence Structure: ${widaAdaptations.sentences}
- Vocabulary Support: ${widaAdaptations.vocabulary}
- Instructional Support: ${widaAdaptations.support}
- Assessment Format: ${widaAdaptations.assessment}

**SUBJECT:** ${params.subject}
**MATERIAL TYPE:** ${params.materialType}
**GRADE LEVEL:** ${params.gradeLevel || 'Not specified'}

${bilingualInstructions}
${iepInstructions}

**CRITICAL REQUIREMENTS:**
1. Include EVERY word of any reading passages - no summarizing or abbreviating
2. Number all questions sequentially (1. 2. 3. etc.)
3. Bold key vocabulary terms throughout using **term** format
4. Use [ ] for checkboxes, not special characters
5. NO placeholder text or abbreviations like "..." or "[continues]"
6. Create complete, print-ready content

**ORIGINAL CONTENT TO ADAPT:**
\`\`\`
${content}
\`\`\`

Generate both:
1. **STUDENT WORKSHEET** - Complete adapted material
2. **TEACHER'S GUIDE** - Answer key, materials needed, objectives, ELL supports, pacing

Respond with:
STUDENT_WORKSHEET:
[Complete student worksheet here]

TEACHER_GUIDE:
[Complete teacher's guide here]`;
    }
  },

  // Structure-only template (for two-step processing)
  structure: {
    build: (params) => {
      const { content, widaAdaptations, analysis } = params;
      
      return `Create the structure and questions for a ${params.materialType} adapted for ${params.proficiencyLevel} students.

**ANALYSIS:** Content Type: ${analysis.structure.contentType}, Complexity: ${analysis.complexity.overall.level}

**ADAPTATIONS:** ${widaAdaptations.sentences}

Where the main content should go, write exactly: {{CONTENT_PLACEHOLDER}}

**SAMPLE CONTENT FOR CONTEXT:**
${content.substring(0, 500)}...

Create complete structure with all questions and activities but use {{CONTENT_PLACEHOLDER}} for the main passage/content.`;
    }
  },

  // Dynamic descriptors template
  descriptors: {
    build: (params) => {
      const { result, subject, proficiencyLevel, analysis } = params;
      
      return `Based on this adapted ${subject} material for ${proficiencyLevel} students, generate specific WIDA descriptors.

**ADAPTED CONTENT SAMPLE:**
${result.studentWorksheet.substring(0, 800)}...

**CONTENT TYPE:** ${analysis.structure.contentType}

Generate JSON with:
{
  "title": "Specific title for this adaptation",
  "descriptors": ["Array of specific learning objectives"],
  "contentSpecificSupports": ["Array of supports actually included"],
  "vocabularySupports": ["Array of key vocabulary terms used"],
  "languageObjectives": ["Array of language learning goals"],
  "assessmentSuggestions": [{"type": "Formative", "description": "specific suggestion"}]
}

CRITICAL: Respond ONLY with valid JSON. No explanations, no markdown.`;
    }
  }
};