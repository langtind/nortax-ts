// file: src/types/tables.ts

// Define the arrays first
export const TABLES_2020_TO_2024 = [
    "7100", "7101", "7102", "7103", "7104", "7105", "7106", "7107",
    "7108", "7109", "7110", "7111", "7112", "7113", "7114", "7115",
    "7116", "7117", "7118", "7119", "7120", "7121", "7122", "7123",
    "7124", "7125", "7126", "7127", "7128", "7129", "7130", "7131",
    "7132", "7133", "7150", "7160", "7170", "7300", "7350", "7500",
    "7550", "7700", "6300", "6350", "6500", "6550", "6700", "0100",
    "0101"
] as const;

export const TABLES_2025 = [
    "8100", "8101", "8102", "8103", "8104", "8105", "8106", "8107",
    "8108", "8109", "8110", "8111", "8112", "8113", "8114", "8115",
    "8116", "8117", "8118", "8119", "8120", "8121", "8122", "8123",
    "8124", "8125", "8126", "8127", "8128", "8129", "8130", "8131",
    "8132", "8133", "8150", "8160", "8170"
] as const;

export type ValidTables2020To2024 = typeof TABLES_2020_TO_2024[number];
export type ValidTables2025 = typeof TABLES_2025[number];

function isValidTable2020To2024(table: string): table is ValidTables2020To2024 {
    return TABLES_2020_TO_2024.includes(table as ValidTables2020To2024);
}

function isValidTable2025(table: string): table is ValidTables2025 {
    return TABLES_2025.includes(table as ValidTables2025);
}

export function isValidTableForYear(table: string, year: number): boolean {
    if (year >= 2020 && year <= 2024) {
        return isValidTable2020To2024(table);
    } else if (year === 2025) {
        return isValidTable2025(table);
    }
    return false;
}
