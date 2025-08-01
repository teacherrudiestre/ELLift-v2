// src/services/api/claude/PromptBuilder.js
export class PromptBuilder {
  constructor() {
    this.templates = {
      adaptation: this.buildAdaptationTemplate(),
      structure: this.buildStructureTemplate(),
      descriptors: this.buildDescriptorsTemplate()
    };
  }

  build(params) {
    const {
      content,
      widaAdaptations,
      bilingualInstructions = '',
      iepInstructions = '',
      analysis,
      params: requestParams
    } = params;

    return `You are an expert ELL curriculum adapter. Create a complete adapted worksheet for ${requestParams.proficiencyLevel} level students.

**CONTENT ANALYSIS:**
- Content Type: ${analysis?.structure?.contentType || 'general'}
- Complexity Level: ${analysis?.complexity?.overall?.level || 'moderate'}
- Word Count: ${analysis?.metadata?.wordCount || 'unknown'}
- Processing Strategy: ${analysis?.complexity?.overall?.processingStrategy || 'standard'}

**PROFICIENCY LEVEL ADAPTATIONS:**
- Sentence Structure: ${widaAdaptations.sentences}
- Vocabulary Support: ${widaAdaptations.vocabulary}
- Instructional Support: ${widaAdaptations.support}
- Assessment Format: ${widaAdaptations.assessment}

**SUBJECT:** ${requestParams.subject}
**MATERIAL TYPE:** ${requestParams.materialType}
**GRADE LEVEL:** ${requestParams.gradeLevel || 'Not specified'}

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

  buildStructurePrompt(params) {
    return `Create the structure and questions for a ${params.materialType} adapted for ${params.proficiencyLevel} students.

Where the main content should go, write exactly: {{CONTENT_PLACEHOLDER}}

**SAMPLE CONTENT FOR CONTEXT:**
${params.content.substring(0, 500)}...

Create complete structure with all questions and activities but use {{CONTENT_PLACEHOLDER}} for the main passage/content.`;
  }

  buildDescriptorsPrompt(params) {
    return `Based on this adapted ${params.subject} material for ${params.proficiencyLevel} students, generate specific WIDA descriptors.

**ADAPTED CONTENT SAMPLE:**
${params.result.studentWorksheet.substring(0, 800)}...

Generate JSON with:
{
  "title": "Specific title for this adaptation",
  "descriptors": ["Array of specific learning objectives"],
  "contentSpecificSupports": ["Array of supports actually included"],
  "vocabularySupports": ["Array of key vocabulary terms used"],
  "languageObjectives": ["Array of language learning goals"],
  "assessmentSuggestions": [{"type": "Formative", "description": "specific suggestion"}]
}

CRITICAL: Respond ONLY with valid JSON.`;
  }

  buildAdaptationTemplate() {
    return (params) => this.build(params);
  }

  buildStructureTemplate() {
    return (params) => this.buildStructurePrompt(params);
  }

  buildDescriptorsTemplate() {
    return (params) => this.buildDescriptorsPrompt(params);
  }
}