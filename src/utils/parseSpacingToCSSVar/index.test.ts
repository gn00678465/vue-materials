import { describe, it, expect } from 'vitest'
import { parseSpacingToCSSVar } from './index'

describe('parseSpacingToCSSVar', () => {
  it('should be defined', () => {
    expect(parseSpacingToCSSVar).toBeDefined()
  })

  it('should handle single value', () => {
    const result = parseSpacingToCSSVar('10px', 'un-')
    expect(result).toEqual({
      '--un-padding-top': '10px',
      '--un-padding-right': '10px',
      '--un-padding-bottom': '10px',
      '--un-padding-left': '10px',
    });
  })

  it('should handle two values', () => {
    const result = parseSpacingToCSSVar('10px 20px', 'theme-');
      expect(result).toEqual({
        '--theme-padding-top': '10px',
        '--theme-padding-right': '20px',
        '--theme-padding-bottom': '10px',
        '--theme-padding-left': '20px',
      });
  })

  it('should handle three values', () => {
    const result = parseSpacingToCSSVar('10px 20px 30px', 'theme-');
    expect(result).toEqual({
      '--theme-padding-top': '10px',
      '--theme-padding-right': '20px',
      '--theme-padding-bottom': '30px',
      '--theme-padding-left': '20px',
    });
  })

  it('should handle four values', () => {
    const result = parseSpacingToCSSVar('10px 20px 30px 40px', 'theme-');
      expect(result).toEqual({
        '--theme-padding-top': '10px',
        '--theme-padding-right': '20px',
        '--theme-padding-bottom': '30px',
        '--theme-padding-left': '40px',
      });
  })

  describe('Spacing Type', () => {
    it('should handle margin type', () => {
      const result = parseSpacingToCSSVar('10px', 'theme-', 'margin');
      expect(result).toEqual({
        '--theme-margin-top': '10px',
        '--theme-margin-right': '10px',
        '--theme-margin-bottom': '10px',
        '--theme-margin-left': '10px',
      });
    });

    it('should default to padding type when not specified', () => {
      const result = parseSpacingToCSSVar('10px', 'theme-');
      expect(result).toEqual({
        '--theme-padding-top': '10px',
        '--theme-padding-right': '10px',
        '--theme-padding-bottom': '10px',
        '--theme-padding-left': '10px',
      });
    });
  });

  describe('Input Validation', () => {
    it('should handle extra whitespace', () => {
      const result = parseSpacingToCSSVar('  10px   20px  ', 'theme-');
      expect(result).toEqual({
        '--theme-padding-top': '10px',
        '--theme-padding-right': '20px',
        '--theme-padding-bottom': '10px',
        '--theme-padding-left': '20px',
      });
    });

    it('should throw error for empty value', () => {
      expect(() => parseSpacingToCSSVar('', 'theme-')).toThrow('Invalid spacing value format');
    });

    it('should throw error for more than 4 values', () => {
      expect(() => parseSpacingToCSSVar('10px 20px 30px 40px 50px', 'theme-')).toThrow('Invalid spacing value format');
    });
  });

  describe('Edge Cases', () => {
    it('should handle different units', () => {
      const result = parseSpacingToCSSVar('10px 2rem 30% 40vh', 'theme-');
      expect(result).toEqual({
        '--theme-padding-top': '10px',
        '--theme-padding-right': '2rem',
        '--theme-padding-bottom': '30%',
        '--theme-padding-left': '40vh',
      });
    });

    it('should handle zero values', () => {
      const result = parseSpacingToCSSVar('0 0 0 0', 'theme-');
      expect(result).toEqual({
        '--theme-padding-top': '0',
        '--theme-padding-right': '0',
        '--theme-padding-bottom': '0',
        '--theme-padding-left': '0',
      });
    });

    it('should handle calc expressions', () => {
      const result = parseSpacingToCSSVar('calc(100% - 20px)', 'theme-');
      expect(result).toEqual({
        '--theme-padding-top': 'calc(100% - 20px)',
        '--theme-padding-right': 'calc(100% - 20px)',
        '--theme-padding-bottom': 'calc(100% - 20px)',
        '--theme-padding-left': 'calc(100% - 20px)',
      });
    });
  });

  describe('Size Parameter', () => {
    it('should handle custom size', () => {
      const result = parseSpacingToCSSVar('10px', 'theme-', 'padding', 'sm');
      expect(result).toEqual({
        '--theme-padding-sm-top': '10px',
        '--theme-padding-sm-right': '10px',
        '--theme-padding-sm-bottom': '10px',
        '--theme-padding-sm-left': '10px',
      });
    });

    it('should handle different size with multiple values', () => {
      const result = parseSpacingToCSSVar('10px 20px 30px', 'theme-', 'margin', 'lg');
      expect(result).toEqual({
        '--theme-margin-lg-top': '10px',
        '--theme-margin-lg-right': '20px',
        '--theme-margin-lg-left': '20px',
        '--theme-margin-lg-bottom': '30px',
      });
    });
  });

  describe('Complex Values with Size', () => {
    it('should handle calc expressions with size', () => {
      const result = parseSpacingToCSSVar('calc(100% - 20px)', 'theme-', 'padding', 'lg');
      expect(result).toEqual({
        '--theme-padding-lg-top': 'calc(100% - 20px)',
        '--theme-padding-lg-right': 'calc(100% - 20px)',
        '--theme-padding-lg-bottom': 'calc(100% - 20px)',
        '--theme-padding-lg-left': 'calc(100% - 20px)',
      });
    });

    it('should handle mixed values with size', () => {
      const result = parseSpacingToCSSVar('10px calc(50% - 10px) 20px', 'theme-', 'margin', 'sm');
      expect(result).toEqual({
        '--theme-margin-sm-top': '10px',
        '--theme-margin-sm-right': 'calc(50% - 10px)',
        '--theme-margin-sm-left': 'calc(50% - 10px)',
        '--theme-margin-sm-bottom': '20px',
      });
    });
  });
})
