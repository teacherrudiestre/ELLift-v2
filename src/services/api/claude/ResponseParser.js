// src/services/api/claude/ResponseParser.js
export class ResponseParser {
  constructor() {
    this.patterns = {
      studentWorksheet: /STUDENT_WORKSHEET:\s*([\s\S]*?)(?=TEACHER_GUIDE:|$)/i,
      teacherGuide: /TEACHER_GUIDE:\s*([\s\S]*?)$/i,
      json: /\{[\s\S]*\}/,
      markdown: /```(?:json)?\s*([\s\S]*?)\s*```/i
    };
  }

  async parseAdaptationResponse(response) {
    const content = response.content[0].text;

    // Try to extract structured response
    const studentMatch = content.match(this.patterns.studentWorksheet);
    const teacherMatch = content.match(this.patterns.teacherGuide);

    if (studentMatch && teacherMatch) {
      return {
        studentWorksheet: studentMatch[1].trim(),
        teacherGuide: teacherMatch[1].trim(),
        rawResponse: content,
        parseMethod: 'structured'
      };
    }

    // Fallback: treat entire response as student worksheet
    return {
      studentWorksheet: content,
      teacherGuide: this.generateFallbackTeacherGuide(content),
      rawResponse: content,
      parseMethod: 'fallback'
    };
  }

  async parseJSONResponse(response) {
    const content = response.content[0].text;

    // Try to extract JSON from markdown
    const markdownMatch = content.match(this.patterns.markdown);
    if (markdownMatch) {
      try {
        return JSON.parse(markdownMatch[1]);
      } catch (error) {
        // Continue to try other methods
      }
    }

    // Try to extract JSON directly
    const jsonMatch = content.match(this.patterns.json);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (error) {
        // Continue to try other methods
      }
    }

    // Try to parse the entire content as JSON
    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to parse JSON response: ${error.message}`);
    }
  }

  generateFallbackTeacherGuide(studentContent) {
    return `# Teacher's Guide

## Overview
This guide accompanies the adapted student worksheet.

## Materials Needed
- Student worksheet
- Answer key (refer to original materials)
- Additional supports as needed

## ELL Supports Included
- Simplified language structure
- Key vocabulary highlighted
- Clear instructions provided

## Pacing Suggestions
- Review vocabulary: 5-10 minutes
- Complete activities: 20-30 minutes
- Discussion/review: 10-15 minutes

## Notes
This is an automatically generated fallback guide. Please review and supplement with your professional judgment.`;
  }

  cleanContent(content) {
    return content
      .replace(/```(?:markdown|html)?\s*/gi, '')
      .replace(/```\s*$/gi, '')
      .trim();
  }

  validateParsedContent(parsed) {
    const issues = [];

    if (!parsed.studentWorksheet || parsed.studentWorksheet.length < 50) {
      issues.push('Student worksheet is too short or missing');
    }

    if (!parsed.teacherGuide || parsed.teacherGuide.length < 50) {
      issues.push('Teacher guide is too short or missing');
    }

    // Check for common parsing issues
    if (parsed.studentWorksheet.includes('TEACHER_GUIDE:')) {
      issues.push('Student worksheet contains teacher guide content');
    }

    if (parsed.teacherGuide.includes('STUDENT_WORKSHEET:')) {
      issues.push('Teacher guide contains student worksheet content');
    }

    return {
      isValid: issues.length === 0,
      issues,
      warningCount: issues.length
    };
  }
}