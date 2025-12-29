export class AppError extends Error {
    public readonly code: string;
    public readonly isOperational: boolean;

    constructor(message: string, code: string = 'UNKNOWN_ERROR', isOperational: boolean = true) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
