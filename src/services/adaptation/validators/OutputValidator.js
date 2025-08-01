// src/services/adaptation/validators/OutputValidator.js
import { PrintValidator } from './PrintValidator';
import { VocabularyValidator } from './VocabularyValidator';
import { StructureValidator } from './StructureValidator';
import { QualityValidator } from './QualityValidator';
import { WidaValidator } from './WidaValidator';

export class OutputValidator {
  constructor() {
    this.printValidator = new PrintValidator();
    this.vocabularyValidator = new VocabularyValidator();
    this.structureValidator = new StructureValidator();
    this.qualityValidator = new QualityValidator();
    this.widaValidator = new WidaValidator();
  }

  /**
   * Comprehensive output validation
   */
  async validate(result, params, options = {}) {
    const {
      checkPrintReadiness = true,
      checkVocabularyIntegration = true,
      checkStructuralIntegrity = true,
      checkWidaCompliance = true,
      checkQuality = true,
      qualityThreshold = 0.8
    } = options;

    const validationResults = {
      timestamp: new Date().toISOString(),
      overall: { isValid: true, score: 1.0, issues: [] },
      components: {}
    };

    try {
      // Run validation checks in parallel
      const validationPromises = [];

      if (checkPrintReadiness) {
        validationPromises.push(
          this.printValidator.validate(result.studentWorksheet)
            .then(r => ({ type: 'print', result: r }))
        );
      }

      if (checkVocabularyIntegration) {
        validationPromises.push(
          this.vocabularyValidator.validate(result.studentWorksheet)
            .then(r => ({ type: 'vocabulary', result: r }))
        );
      }

      if (checkStructuralIntegrity) {
        validationPromises.push(
          this.structureValidator.validate(result)
            .then(r => ({ type: 'structure', result: r }))
        );
      }

      if (checkWidaCompliance) {
        validationPromises.push(
          this.widaValidator.validate(result, params)
            .then(r => ({ type: 'wida', result: r }))
        );
      }

      if (checkQuality) {
        validationPromises.push(
          this.qualityValidator.validate(result, params)
            .then(r => ({ type: 'quality', result: r }))
        );
      }

      const results = await Promise.all(validationPromises);

      // Process results
      let totalScore = 0;
      let totalWeight = 0;
      const allIssues = [];

      results.forEach(({ type, result }) => {
        validationResults.components[type] = result;
        
        if (result.weight) {
          totalScore += result.score * result.weight;
          totalWeight += result.weight;
        }

        if (result.issues) {
          allIssues.push(...result.issues.map(issue => ({ type, ...issue })));
        }

        if (!result.isValid) {
          validationResults.overall.isValid = false;
        }
      });

      // Calculate overall score
      validationResults.overall.score = totalWeight > 0 ? totalScore / totalWeight : 1.0;
      validationResults.overall.issues = allIssues;
      validationResults.overall.passesThreshold = validationResults.overall.score >= qualityThreshold;

      // Generate recommendations
      validationResults.recommendations = this.generateRecommendations(validationResults);

      return validationResults;

    } catch (error) {
      throw new Error(`Validation failed: ${error.message}`);
    }
  }

  /**
   * Generate actionable recommendations based on validation results
   */
  generateRecommendations(validationResults) {
    const recommendations = [];
    const { components, overall } = validationResults;

    // Print readiness recommendations
    if (components.print && !components.print.isValid) {
      recommendations.push({
        category: 'Print Readiness',
        priority: 'high',
        issue: 'Content not ready for printing',
        suggestion: 'Review and fix formatting issues, remove placeholders',
        autoFixable: true
      });
    }

    // Vocabulary recommendations
    if (components.vocabulary && components.vocabulary.score < 0.7) {
      recommendations.push({
        category: 'Vocabulary',
        priority: 'medium',
        issue: 'Insufficient vocabulary integration',
        suggestion: 'Bold more key terms and add vocabulary definitions',
        autoFixable: false
      });
    }

    // Structure recommendations
    if (components.structure && !components.structure.isValid) {
      recommendations.push({
        category: 'Structure',
        priority: 'high',
        issue: 'Structural integrity issues detected',
        suggestion: 'Review content organization and formatting consistency',
        autoFixable: false
      });
    }

    // WIDA compliance recommendations
    if (components.wida && components.wida.score < 0.8) {
      recommendations.push({
        category: 'WIDA Compliance',
        priority: 'high',
        issue: 'Content may not align with WIDA standards',
        suggestion: 'Review language complexity and proficiency level alignment',
        autoFixable: false
      });
    }

    // Overall quality recommendations
    if (overall.score < 0.7) {
      recommendations.push({
        category: 'Overall Quality',
        priority: 'high',
        issue: 'Content quality below threshold',
        suggestion: 'Consider regenerating with different parameters',
        autoFixable: false
      });
    }

    return recommendations;
  }
}