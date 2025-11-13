export class AppError extends Error {
    constructor({ message, statusCode, field }) {
        super(message);
        this.statusCode = statusCode;
        this.field = field; 
    }

    toJSON() {
        return {
            message: this.message,
            statusCode: this.statusCode,
            field: this.field, 
        };
    }
}