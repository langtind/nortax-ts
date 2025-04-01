export const BASE_URL = 'https://trekktabell.formueinntekt.skatt.skatteetaten.no/api/trekktabell';
export const CALCULATE_URL = `${BASE_URL}/beregn`;
export const TABLE_URL = `${BASE_URL}/tabell`;

export const PERIODS: Record<string, string> = {
  Wage: 'LONN',
  Pension: 'PENSJON',
  '1 day': 'PERIODE_1_DAG',
  '2 days': 'PERIODE_2_DAGER',
  '3 days': 'PERIODE_3_DAGER',
  '4 days': 'PERIODE_4_DAGER',
  '1 week': 'PERIODE_1_UKE',
  '2 weeks': 'PERIODE_14_DAGER',
  Monthly: 'PERIODE_1_MAANED',
} as const;

export const ALIASES = {
  allDeductions: 'alleTrekk',
  chosenTable: 'tabell',
  chosenIncomeType: 'inntektstype',
  chosenPeriod: 'periode',
  chosenIncome: 'bruttoloenn',
  showWholeTable: 'visHeleTabellen',
  chosenYear: 'iaar',
  getWholeTable: 'hentHeleTabellen',
} as const;
