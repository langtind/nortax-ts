export class TaxApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TaxApiError';
    }
}

export class TaxNetworkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TaxNetworkError';
    }
}
