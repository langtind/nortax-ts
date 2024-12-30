export const BASE_URL = 'https://api-tabellkort.app.skatteetaten.no/';

export const PERIODS: Record<string, string> = {
  Wage: 'Lonn',
  Pension: 'Pensjon',
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
  chosenTable: 'valgtTabell',
  chosenIncomeType: 'valgtInntektType',
  chosenPeriod: 'valgtPeriode',
  chosenIncome: 'valgtLonn',
  showWholeTable: 'visHeleTabellen',
  chosenYear: 'valgtAar',
  getWholeTable: 'hentHeleTabellen',
} as const;
