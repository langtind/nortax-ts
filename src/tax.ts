/**
 * nortax-ts
 * A TypeScript port of nortax (https://github.com/lewiuberg/nortax)
 * Original Copyright (c) 2023 Lewi Lie Uberg
 * TypeScript port Copyright (c) 2024 Arild Langtind
 * Licensed under the MIT License
 */

import { IncomeType, Period } from './types';
import {
  ValidTablesTo2019,
  ValidTables2020To2024,
  ValidTables2025,
  isValidTableForYear,
} from './types';
import { BASE_URL, PERIODS, ALIASES } from './constants';
import { TaxApiError, TaxNetworkError } from './errors';

type ValidTable = ValidTablesTo2019 | ValidTables2020To2024 | ValidTables2025;

export class Tax {
  private grossIncome: number;
  private taxTable: ValidTable;
  private incomeType: IncomeType;
  private period: Period;
  private year: number;
  private returnWholeTable: boolean;
  private url: string;

  constructor(
    grossIncome: number = 0,
    taxTable: ValidTable = '7100',
    incomeType: IncomeType = 'Wage',
    period: Period = 'Monthly',
    year: number = 2024
  ) {
    if (!isValidTableForYear(taxTable, year)) {
      throw new Error(`Invalid tax table "${taxTable}" for year ${year}`);
    }

    this.grossIncome = grossIncome;
    this.taxTable = taxTable;
    this.incomeType = incomeType;
    this.period = period;
    this.year = year;
    this.returnWholeTable = false;
    this.url = BASE_URL;
  }

  private async makeApiCall(url: string): Promise<any> {
    let response;
    try {
      response = await fetch(url);
    } catch (error) {
      throw new TaxNetworkError(
        `Failed to fetch tax data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    if (!response.ok) {
      throw new TaxApiError(`API call failed: ${response.statusText}`);
    }

    try {
      const data = await response.json();
      return data === null ? 0 : data;
    } catch (error) {
      throw new TaxApiError(
        `Invalid JSON response: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private updateUrl(): void {
    this.url =
      `${BASE_URL}?` +
      `${ALIASES.chosenTable}=${this.taxTable}&` +
      `${ALIASES.chosenIncomeType}=${this.incomeType}&` +
      `${ALIASES.chosenPeriod}=${this.period}&` +
      `${ALIASES.chosenIncome}=${this.grossIncome}&` +
      `${ALIASES.showWholeTable}=${this.returnWholeTable}&` +
      `${ALIASES.chosenYear}=${this.year}&` +
      `${ALIASES.getWholeTable}=${this.returnWholeTable}`;

    Object.entries(PERIODS).forEach(([key, value]) => {
      this.url = this.url.replace(key, value);
    });
  }

  async getDeduction(): Promise<number> {
    this.updateUrl();
    const data = await this.makeApiCall(this.url);
    return parseInt(data);
  }

  async getNetIncome(): Promise<number> {
    const deduction = await this.getDeduction();
    return this.grossIncome - deduction;
  }

  async getWholeTable(): Promise<Record<string, number>> {
    this.returnWholeTable = true;
    this.updateUrl();
    const data = await this.makeApiCall(this.url);
    this.returnWholeTable = false;
    return data[ALIASES.allDeductions];
  }

  async getFullDetails(): Promise<string> {
    const deduction = await this.getDeduction();
    const netIncome = await this.getNetIncome();
    return `URL: str = ${this.url}
Tax table: valid_tables = ${this.taxTable}
Income type: income_type = ${this.incomeType}
Period: period = ${this.period}
Year: int = ${this.year}
Gross income: int = ${this.grossIncome}
Tax deduction: int = ${deduction}
Net income: int = ${netIncome}`;
  }

  toString(): string {
    return `URL: str = ${this.url}
Tax table: valid_tables = ${this.taxTable}
Income type: income_type = ${this.incomeType}
Period: period = ${this.period}
Year: int = ${this.year}
Gross income: int = ${this.grossIncome}`;
  }

  [Symbol.toStringTag](): string {
    return `Tax(gross_income=${this.grossIncome}, tax_table="${this.taxTable}", income_type="${this.incomeType}", period="${this.period}", year=${this.year})`;
  }
}
