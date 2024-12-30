import { Tax } from '../tax';

const ENABLE_INTEGRATION_TESTS = process.env.ENABLE_INTEGRATION_TESTS === 'true';

(ENABLE_INTEGRATION_TESTS ? describe : describe.skip)('Tax Integration Tests', () => {
  jest.setTimeout(10000);

  describe('2024 Tax Table 7100 (Standard)', () => {
    const year = 2024;
    const table = '7100';

    it('should return correct monthly deduction for 600000 NOK annual wage', async () => {
      const tax = new Tax(
        50000, // 600k NOK annual / 12 months
        table,
        'Wage',
        'Monthly',
        year
      );

      const deduction = await tax.getDeduction();
      expect(deduction).toBe(14774);
    });

    it('should return correct bi-weekly deduction for 600000 NOK annual wage', async () => {
      const tax = new Tax(
        23077, // Approximate bi-weekly for 600k annual
        table,
        'Wage',
        '2 weeks',
        year
      );

      const deduction = await tax.getDeduction();
      expect(deduction).toBe(6735);
    });

    it('should return correct weekly deduction for 600000 NOK annual wage', async () => {
      const tax = new Tax(
        11538, // Approximate weekly for 600k annual
        table,
        'Wage',
        '1 week',
        year
      );

      const deduction = await tax.getDeduction();
      expect(deduction).toBe(3365);
    });
  });

  describe('2024 Tax Table 7150 (Special)', () => {
    const year = 2024;
    const table = '7150';

    it('should return correct monthly deduction for 450000 NOK annual wage', async () => {
      const tax = new Tax(
        37500, // 450k NOK annual / 12 months
        table,
        'Wage',
        'Monthly',
        year
      );

      const deduction = await tax.getDeduction();
      expect(deduction).toBe(8533);
    });
  });

  describe('2024 Pension Tax Table 6300', () => {
    const year = 2024;
    const table = '7105';

    it('should return correct monthly deduction for 300000 NOK annual pension', async () => {
      const tax = new Tax(
        25000, // 300k NOK annual / 12 months
        table,
        'Pension',
        'Monthly',
        year
      );

      const deduction = await tax.getDeduction();
      expect(deduction).toBe(3282); // Interesting - might need to investigate why this returns 0
    });
  });

  describe('Whole Table Tests 2024', () => {
    it('should return correct tax brackets for table 7100', async () => {
      const tax = new Tax(50000, '7100', 'Wage', 'Monthly', 2024);

      const table = await tax.getWholeTable();

      // Test specific brackets with actual values
      expect(table['30000']).toBe(6971);
      expect(table['40000']).toBe(10872);
      expect(table['50000']).toBe(14774);
    });
  });

  describe('Tax Table 8150 Tests', () => {
    const tableNumber = '8150';

    it('should throw error when trying to use table 8150 in 2024', () => {
      expect(() => new Tax(50000, tableNumber, 'Wage', 'Monthly', 2024)).toThrow(
        'Invalid tax table "8150" for year 2024'
      );
    });

    it('should return correct monthly deduction for table 8150 in 2025', async () => {
      const tax = new Tax(50000, tableNumber, 'Wage', 'Monthly', 2025);

      const taxTable = await tax.getWholeTable();
      expect(taxTable['50000']).toBe(11333);
    });
  });
});
