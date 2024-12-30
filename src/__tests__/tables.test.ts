import { isValidTableForYear } from '../types';

describe('Tax Table Validation', () => {
  describe('2020-2024 tables', () => {
    it('should validate correct tables for 2024', () => {
      expect(isValidTableForYear('7100', 2024)).toBe(true);
      expect(isValidTableForYear('7150', 2024)).toBe(true);
      expect(isValidTableForYear('8150', 2024)).toBe(false);
    });
  });

  describe('2025 tables', () => {
    it('should validate correct tables for 2025', () => {
      expect(isValidTableForYear('8150', 2025)).toBe(true);
      expect(isValidTableForYear('7100', 2025)).toBe(false);
    });
  });

  describe('invalid years', () => {
    it('should return false for years outside valid range', () => {
      expect(isValidTableForYear('7100', 2019)).toBe(false);
      expect(isValidTableForYear('8150', 2026)).toBe(false);
    });
  });
});
