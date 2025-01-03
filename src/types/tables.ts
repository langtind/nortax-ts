// prettier-ignore
export const TABLES_TO_2019 = [
  "7100", "7101", "4000", "7102", "8000", "7103", "7104", "7105",
  "7106", "7107", "7108", "7109", "7110", "7111", "7112", "7113",
  "7114", "7115", "7116", "7117", "7118", "7119", "7120", "4000",
  "7121", "8000", "7122", "7123", "7124", "7125", "7126", "7127",
  "7128", "7129", "7130", "7131", "7132", "7133"
] as const;

// prettier-ignore
export const TABLES_2020_TO_2024 = [
  "7100", "7101", "7102", "7103", "7104", "7105", "7106", "7107",
  "7108", "7109", "7110", "7111", "7112", "7113", "7114", "7115",
  "7116", "7117", "7118", "7119", "7120", "7121", "7122", "7123",
  "7124", "7125", "7126", "7127", "7128", "7129", "7130", "7131",
  "7132", "7133", "7150", "7160", "7170", "7300", "7350", "7500",
  "7550", "7700", "6300", "6350", "6500", "6550", "6700", "0100",
  "0101"
] as const;

// prettier-ignore
export const TABLES_2025 = [
  "8000", "8010", "8020", "8030", "8040", "8050", "8060", "8070",
  "8080", "8090", "8100", "8110", "8120", "8130", "8140", "8150",
  "8160", "8170", "8180", "8190", "8200", "8210", "8220", "8230",
  "8240", "8250", "8260", "8270", "8280", "8290", "8300", "8310",
  "8320", "8330", "8340", "8350", "8360", "8370", "8380", "8390",
  "8400", "9010", "9020", "9030", "9040", "9050", "9060", "9070",
  "9080", "9090", "9100", "9110", "9120", "9130", "9140", "9150",
  "9160", "9170", "9180", "9190", "9200", "9210", "9220", "9230",
  "9240", "9250", "9260", "9270", "9280", "9290", "9300", "9310",
  "9320", "9330", "9340", "9350", "9360", "9370", "9380", "9390",
  "9400"
] as const;

export type ValidTablesTo2019 = (typeof TABLES_TO_2019)[number];
export type ValidTables2020To2024 = (typeof TABLES_2020_TO_2024)[number];
export type ValidTables2025 = (typeof TABLES_2025)[number];

function isValidTableTo2019(table: string): table is ValidTablesTo2019 {
  return TABLES_TO_2019.includes(table as ValidTablesTo2019);
}

function isValidTable2020To2024(table: string): table is ValidTables2020To2024 {
  return TABLES_2020_TO_2024.includes(table as ValidTables2020To2024);
}

function isValidTable2025(table: string): table is ValidTables2025 {
  return TABLES_2025.includes(table as ValidTables2025);
}

export function isValidTableForYear(table: string, year: number): boolean {
  if (year <= 2019) {
    return isValidTableTo2019(table);
  } else if (year >= 2020 && year <= 2024) {
    return isValidTable2020To2024(table);
  } else if (year === 2025) {
    return isValidTable2025(table);
  }
  return false;
}
