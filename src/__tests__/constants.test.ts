import { BASE_URL, PERIODS, ALIASES } from '../constants';

describe('Constants', () => {
  describe('BASE_URL', () => {
    it('should be defined', () => {
      expect(BASE_URL).toBeDefined();
      expect(BASE_URL).toBe(
        'https://trekktabell.formueinntekt.skatt.skatteetaten.no/api/trekktabell'
      );
    });
  });

  describe('PERIODS', () => {
    it('should have correct mappings', () => {
      expect(PERIODS['Wage']).toBe('LONN');
      expect(PERIODS['Pension']).toBe('PENSJON');
      expect(PERIODS['Monthly']).toBe('PERIODE_1_MAANED');
      expect(PERIODS['1 week']).toBe('PERIODE_1_UKE');
    });
  });

  describe('ALIASES', () => {
    it('should have correct API parameter mappings', () => {
      expect(ALIASES.chosenTable).toBe('tabell');
      expect(ALIASES.chosenIncome).toBe('bruttoloenn');
      expect(ALIASES.chosenPeriod).toBe('periode');
      expect(ALIASES.chosenYear).toBe('iaar');
      expect(ALIASES.chosenIncomeType).toBe('inntektstype');
    });
  });
});
