# NorTax-TS <!-- omit in toc -->

A TypeScript client for the Norwegian tax authority’s API, based on the [original Python package](https://github.com/lewiuberg/nortax). This library focuses on fetching Norwegian tax calculations for various income types, periods, and tables.

[![GitHub License](https://img.shields.io/github/license/langtind/nortax-ts?color=blue)](LICENSE)
[![npm version](https://img.shields.io/npm/v/nortax-ts.svg?color=blue)](https://www.npmjs.com/package/nortax-ts)
[![GitHub last commit](https://img.shields.io/github/last-commit/langtind/nortax-ts?color=blue)](https://github.com/langtind/nortax-ts)
![GitHub search hit counter](https://img.shields.io/github/search/langtind/nortax-ts?label=nortax-ts%20searches)
[![Test](https://github.com/langtind/nortax-ts/actions/workflows/test.yml/badge.svg)](https://github.com/langtind/nortax-ts/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/langtind/nortax-ts/branch/main/graph/badge.svg)](https://codecov.io/gh/langtind/nortax-ts)

> **Note:** This library is the TypeScript variant of the Nortax project. For the Python version, visit [github.com/lewiuberg/nortax](https://github.com/lewiuberg/nortax).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
    - [Import the `Tax` Class](#import-the-tax-class)
    - [Create a `Tax` Object](#create-a-tax-object)
    - [Obtain Tax Details](#obtain-tax-details)
    - [Retrieving the Whole Table](#retrieving-the-whole-table)
- [Examples](#examples)
- [Testing](#testing)
- [Supported Values](#supported-values)
    - [Income Types](#income-types)
    - [Periods](#periods)
    - [Tax Tables](#tax-tables)
- [License](#license)

## Installation

```bash
npm install nortax-ts
```

Or use your preferred package manager:

```bash
yarn add nortax-ts
pnpm add nortax-ts
```

## Usage

### Import the `Tax` Class

```typescript
import { Tax } from 'nortax-ts';
```

### Create a `Tax` Object

```typescript
// Create a Tax object with default or custom parameters
const tax = new Tax(
25000,        // grossIncome
'7100',       // taxTable
'Pension',    // incomeType
'2 weeks',    // period
2024          // year
);
```

### Obtain Tax Details

```typescript
(async () => {
// Get the deduction
const deduction = await tax.getDeduction();
console.log('Tax deduction:', deduction);

// Get the net income
const netIncome = await tax.getNetIncome();
console.log('Net income:', netIncome);

// Get a descriptive string with all details
const fullDetails = await tax.getFullDetails();
console.log(fullDetails);
})();
```

**Example output (for `getFullDetails()`):**

```shell
URL: str = https://api-tabellkort.app.skatteetaten.no/?valgtTabell=7100&valgtInntektType=Pensjon&valgtPeriode=PERIODE_14_DAGER&valgtLonn=25000&visHeleTabellen=false&valgtAar=2024&hentHeleTabellen=false
Tax table: valid_tables = 7100
Income type: income_type = Pension
Period: period = 2 weeks
Year: int = 2024
Gross income: int = 25000
Tax deduction: int = 6735
Net income: int = 18265
```

### Retrieving the Whole Table

```typescript
(async () => {
const wholeTable = await tax.getWholeTable();
console.log('Whole table:', wholeTable);
})();
```

Example output (truncated for readability):

```json
{
"30000": 6971,
"40000": 10872,
"50000": 14774
}
```

## Examples

```typescript
import { Tax } from 'nortax-ts';

(async () => {
// 1) Instantiate a Tax object with desired parameters
const myTax = new Tax(50000, '7100', 'Wage', 'Monthly', 2024);

// 2) Fetch deduction
const deduction = await myTax.getDeduction();
console.log(`Monthly deduction on 50k gross: ${deduction}`);

// 3) Fetch net income
const netIncome = await myTax.getNetIncome();
console.log(`Net income: ${netIncome}`);

// 4) Obtain the entire deduction table if needed
const table = await myTax.getWholeTable();
console.log('Deduction table for various incomes:', table);
})();
```

## Testing

This project uses [Jest](https://jestjs.io/) for both unit and integration testing.

- Run all tests (without integration tests):
    ```bash
    npm test
    ```

- Run with coverage:
  ```bash
  npm run test:coverage
  ```

- Run integration tests (this hits the live API; ensure your network is available):
  ```bash
  npm run test:integration
  ```

## Supported Values

### Income Types

- **Wage**
- **Pension**

### Periods

- `1 day`
- `2 days`
- `3 days`
- `4 days`
- `1 week`
- `2 weeks`
- `Monthly`

### Tax Tables

The tax tables are year-specific in the Norwegian tax system:

#### 2020-2024 Tables
Standard tables (`7100`-`7133`), special tables (`7150`, `7160`, `7170`), and pension tables (`6300`, `6350`, etc.).

Example usage:
```typescript
// Valid for 2020-2024
const tax2024 = new Tax(50000, '7100', 'Wage', 'Monthly', 2024);
```

#### 2025 Tables
New table system starting with 8xxx series (8100-8133, 8150, 8160, etc.).

Example usage:
```typescript
// Valid only for 2025
const tax2025 = new Tax(50000, '8150', 'Wage', 'Monthly', 2025);
```
>Note: Using a tax table with an incorrect year (e.g., trying to use table '8150' in 2024) will throw an error.

Error handling example:
```typescript
// This will throw an error
try {
  const invalidTax = new Tax(50000, '8150', 'Wage', 'Monthly', 2024);
} catch (error) {
  console.error(error); // Error: Invalid tax table "8150" for year 2024
}
```
For a complete list of valid tables per year, see:
* [2020-2024 Tables](https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/skattekort-og-skattetrekk/forskuddstrekk/oversikt-over-tabelltrinnene-for-trekktabeller-fra-og-med-2020/)
* [2025 Tables](https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/skattekort-og-skattetrekk/forskuddstrekk/oversikt-over-tabelltrinnene-for-trekktabeller-fra-og-med-2025/)

## License

This project is released under the [MIT License](LICENSE).  

For more details on the original Python package, visit [github.com/lewiuberg/nortax](https://github.com/lewiuberg/nortax).  
