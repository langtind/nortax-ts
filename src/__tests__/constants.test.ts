import { BASE_URL, PERIODS, ALIASES } from '../constants';

describe('Constants', () => {
  describe('BASE_URL', () => {
    it('should be defined', () => {
      expect(BASE_URL).toBeDefined();
      expect(BASE_URL).toBe('https://api-tabellkort.app.skatteetaten.no/');
    });
  });

  describe('PERIODS', () => {
    it('should have correct mappings', () => {
      expect(PERIODS['Wage']).toBe('Lonn');
      expect(PERIODS['Pension']).toBe('Pensjon');
      expect(PERIODS['Monthly']).toBe('PERIODE_1_MAANED');
      expect(PERIODS['1 week']).toBe('PERIODE_1_UKE');
    });
  });

  describe('ALIASES', () => {
    it('should have correct API parameter mappings', () => {
      expect(ALIASES.chosenTable).toBe('valgtTabell');
      expect(ALIASES.chosenIncome).toBe('valgtLonn');
      expect(ALIASES.chosenPeriod).toBe('valgtPeriode');
    });
  });
});
