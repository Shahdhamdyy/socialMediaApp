
interface IError {
    status: number;
    message: string;
    cause?: unknown;
}

export class ApplicationError extends Error implements IError {


    constructor(message: string, public status: number, cause?: unknown) {
        super(message, { cause });
        this.name = this.constructor.name;

    }
}
export class BadRequestException extends ApplicationError {
    constructor(message: string, cause?: unknown) {
        super(message, 400, { cause });
    }
}
export class ConflictException extends ApplicationError {
    constructor(message: string, cause?: unknown) {
        super(message, 409, { cause });
    }

}

export class UnauthorizedException extends ApplicationError {
    constructor(message: string, cause?: unknown) {
        super(message, 401, { cause });
    }
}

export class NotFoundException extends ApplicationError {
    constructor(message: string, cause?: unknown) {
        super(message, 404, { cause });
    }
}