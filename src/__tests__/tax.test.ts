import {Tax} from '../tax';
import {TaxApiError} from "../errors";

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

describe('Tax', () => {
    beforeEach(() => {
        mockFetch.mockReset();
    });

    // ... existing constructor tests ...

    describe('edge cases and validation', () => {
        it('should handle negative gross income', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(0)
            });

            const tax = new Tax(-5000);
            const deduction = await tax.getDeduction();

            expect(deduction).toBe(0);
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('valgtLonn=-5000')
            );
        });

        it('should handle zero gross income', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(0)
            });

            const tax = new Tax(0);
            const deduction = await tax.getDeduction();

            expect(deduction).toBe(0);
        });

        it('should handle very large income values', async () => {
            const largeIncome = 999999999;
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(300000)
            });

            const tax = new Tax(largeIncome);
            const deduction = await tax.getDeduction();

            expect(deduction).toBe(300000);
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining(`valgtLonn=${largeIncome}`)
            );
        });

        it('should handle decimal income values', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(5000)
            });

            const tax = new Tax(25000.50);
            await tax.getDeduction();

            // Should use integer value in API call
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('valgtLonn=25000')
            );
        });
    });

    describe('API error handling', () => {
        it('should handle empty response', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(null)
            });

            const tax = new Tax(25000);
            const deduction = await tax.getDeduction();

            expect(deduction).toBe(0); // Should default to 0 for invalid response
        });

        it('should handle malformed JSON response', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.reject(new Error('Invalid JSON'))
            });

            const tax = new Tax(25000);
            await expect(tax.getDeduction())
                .rejects
                .toThrow('Invalid JSON response'); // Changed to match new error message
        });

        // Alternative approach with more specific testing:
        it('should handle malformed JSON response with specific error', async () => {
            // Set up mock for both calls
            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.reject(new Error('Invalid JSON'))
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.reject(new Error('Invalid JSON'))
                });

            const tax = new Tax(25000);

            // Test both error type and message in a single assertion
            await expect(tax.getDeduction())
                .rejects
                .toThrow(expect.objectContaining({
                    name: 'TaxApiError',
                    message: expect.stringMatching(/Invalid JSON response/)
                }));
        });


        it('should handle timeout errors', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Request timeout'));

            const tax = new Tax(25000);
            await expect(tax.getDeduction()).rejects.toThrow('Failed to fetch tax data: Request timeout');
        });

        it('should handle 500 server error', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                statusText: 'Internal Server Error',
                status: 500
            });

            const tax = new Tax(25000);
            await expect(tax.getDeduction()).rejects.toThrow('API call failed: Internal Server Error');
        });

        it('should handle non-Error objects in catch block', async () => {
            // Mock fetch to reject with a non-Error object
            mockFetch.mockRejectedValueOnce('String error');  // Just a string, not an Error

            const tax = new Tax(25000);
            await expect(tax.getDeduction())
                .rejects
                .toThrow('Failed to fetch tax data: Unknown error');
        });

        it('should handle undefined error in catch block', async () => {
            // Mock fetch to reject with undefined
            mockFetch.mockRejectedValueOnce(undefined);

            const tax = new Tax(25000);
            await expect(tax.getDeduction())
                .rejects
                .toThrow('Failed to fetch tax data: Unknown error');
        });

        it('should handle null error in catch block', async () => {
            // Mock fetch to reject with null
            mockFetch.mockRejectedValueOnce(null);

            const tax = new Tax(25000);
            await expect(tax.getDeduction())
                .rejects
                .toThrow('Failed to fetch tax data: Unknown error');
        });

    });

    describe('period handling', () => {
        it.each([
            ['1 day', 'PERIODE_1_DAG'],
            ['2 days', 'PERIODE_2_DAGER'],
            ['3 days', 'PERIODE_3_DAGER'],
            ['4 days', 'PERIODE_4_DAGER'],
            ['1 week', 'PERIODE_1_UKE'],
            ['2 weeks', 'PERIODE_14_DAGER'],
            ['Monthly', 'PERIODE_1_MAANED']
        ])('should handle period %s correctly', async (period, expectedValue) => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(1000)
            });

            const tax = new Tax(25000, '7100', 'Wage', period as any);
            await tax.getDeduction();

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining(expectedValue)
            );
        });
    });

    describe('tax table handling', () => {
        it.each([
            ['7100', 'standard'],
            ['7101', 'alternative'],
            ['7150', 'special'],
            ['6300', 'pension']
        ])('should handle tax table %s correctly', async (table, _type) => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(1000)
            });

            const tax = new Tax(25000, table as any);
            await tax.getDeduction();

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining(`valgtTabell=${table}`)
            );
        });
    });

    describe('income type handling', () => {
        it('should handle Wage income type correctly', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(1000)
            });

            const tax = new Tax(25000, '7100', 'Wage');
            await tax.getDeduction();

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('Lonn')
            );
        });

        it('should handle Pension income type correctly', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(1000)
            });

            const tax = new Tax(25000, '7100', 'Pension');
            await tax.getDeduction();

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('Pensjon')
            );
        });
    });

    describe('whole table handling', () => {
        it('should handle empty table response', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ alleTrekk: {} })
            });

            const tax = new Tax();
            const table = await tax.getWholeTable();

            expect(table).toEqual({});
        });

        it('should handle missing alleTrekk in response', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({})
            });

            const tax = new Tax();
            const table = await tax.getWholeTable();

            expect(table).toBeUndefined();
        });
    });

    describe('tax table validation', () => {
        it('should throw error for invalid table/year combination (8150 in 2024)', () => {
            expect(() => new Tax(50000, "8150", "Wage", "Monthly", 2024))
                .toThrow('Invalid tax table "8150" for year 2024');
        });

        it('should throw error for invalid table/year combination (7100 in 2025)', () => {
            expect(() => new Tax(50000, "7100", "Wage", "Monthly", 2025))
                .toThrow('Invalid tax table "7100" for year 2025');
        });

        it('should accept valid table for 2024', () => {
            expect(() => new Tax(50000, "7100", "Wage", "Monthly", 2024))
                .not.toThrow();
        });

        it('should accept valid table for 2025', () => {
            expect(() => new Tax(50000, "8150", "Wage", "Monthly", 2025))
                .not.toThrow();
        });
    });

    describe('getFullDetails', () => {
        it('should return formatted string with all tax details', async () => {
            // Mock the fetch call twice since getDeduction is called twice
            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(6735)
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(6735)
                });

            const tax = new Tax(
                25000,      // grossIncome
                "7100",     // taxTable
                "Pension",  // incomeType
                "2 weeks",  // period
                2024       // year
            );

            const details = await tax.getFullDetails();
            expect(details).toContain('URL: str = https://api-tabellkort.app.skatteetaten.no/');
            expect(details).toContain('Tax table: valid_tables = 7100');
            expect(details).toContain('Income type: income_type = Pension');
            expect(details).toContain('Period: period = 2 weeks');
            expect(details).toContain('Year: int = 2024');
            expect(details).toContain('Gross income: int = 25000');
            expect(details).toContain('Tax deduction: int = 6735');
            expect(details).toContain('Net income: int = 18265');  // 25000 - 6735
        });

        it('should handle API errors gracefully', async () => {
            mockFetch.mockRejectedValueOnce(new Error('API Error'));

            const tax = new Tax(25000);

            await expect(tax.getFullDetails()).rejects.toThrow('Failed to fetch tax data');
        });

        it('should handle null response', async () => {
            // Mock both fetch calls to return null
            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(null)
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(null)
                });

            const tax = new Tax(25000);
            const details = await tax.getFullDetails();

            expect(details).toContain('Tax deduction: int = 0');
            expect(details).toContain('Net income: int = 25000');  // 25000 - 0
        });

        it('should throw error for invalid table 8150 in 2024', () => {
            // Test the constructor directly since that's where the validation happens
            expect(() => new Tax(
                50000,      // grossIncome
                "8150",     // invalid table for 2024
                "Wage",
                "Monthly",
                2024
            )).toThrow('Invalid tax table "8150" for year 2024');
        });

        it('should work with table 8150 in 2025', async () => {
            // Mock both fetch calls needed for getFullDetails
            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(11333)  // Known value for 50000 NOK
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(11333)
                });

            const tax = new Tax(
                50000,      // grossIncome
                "8150",     // valid table for 2025
                "Wage",
                "Monthly",
                2025
            );

            const details = await tax.getFullDetails();

            expect(details).toContain('Tax table: valid_tables = 8150');
            expect(details).toContain('Year: int = 2025');
            expect(details).toContain('Tax deduction: int = 11333');
            expect(details).toContain('Net income: int = 38667');  // 50000 - 11333
        });
    });

    describe('toString', () => {
        it('should return formatted string with basic tax details', () => {
            const tax = new Tax(
                25000,      // grossIncome
                "7100",     // taxTable
                "Pension",  // incomeType
                "2 weeks",  // period
                2024       // year
            );

            const result = tax.toString();

            // Check each line individually
            expect(result).toContain('URL: str = https://api-tabellkort.app.skatteetaten.no/');
            expect(result).toContain('Tax table: valid_tables = 7100');
            expect(result).toContain('Income type: income_type = Pension');
            expect(result).toContain('Period: period = 2 weeks');
            expect(result).toContain('Year: int = 2024');
            expect(result).toContain('Gross income: int = 25000');
        });

        it('should work with default values', () => {
            const tax = new Tax();
            const result = tax.toString();

            expect(result).toContain('Tax table: valid_tables = 7100');
            expect(result).toContain('Income type: income_type = Wage');
            expect(result).toContain('Period: period = Monthly');
            expect(result).toContain('Year: int = 2024');
            expect(result).toContain('Gross income: int = 0');
        });

        it('should handle 2025 tax table', () => {
            const tax = new Tax(
                50000,
                "8150",
                "Wage",
                "Monthly",
                2025
            );

            const result = tax.toString();
            expect(result).toContain('Tax table: valid_tables = 8150');
            expect(result).toContain('Year: int = 2025');
        });
    });

    describe('Symbol.toStringTag', () => {
        it('should return correctly formatted string representation', () => {
            const tax = new Tax(
                25000,      // grossIncome
                "7100",     // taxTable
                "Pension",  // incomeType
                "2 weeks",  // period
                2024       // year
            );

            const result = tax[Symbol.toStringTag]();
            expect(result).toBe('Tax(gross_income=25000, tax_table="7100", income_type="Pension", period="2 weeks", year=2024)');
        });

        it('should work with default values', () => {
            const tax = new Tax();
            const result = tax[Symbol.toStringTag]();
            expect(result).toBe('Tax(gross_income=0, tax_table="7100", income_type="Wage", period="Monthly", year=2024)');
        });

        it('should handle 2025 tax table', () => {
            const tax = new Tax(
                50000,
                "8150",
                "Wage",
                "Monthly",
                2025
            );

            const result = tax[Symbol.toStringTag]();
            expect(result).toBe('Tax(gross_income=50000, tax_table="8150", income_type="Wage", period="Monthly", year=2025)');
        });
    });

});
