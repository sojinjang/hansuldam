class ExtendableError extends Error {
    errorMessage: string | any;
    statusCode: number;
    errorCode: number | null;
    constructor(message: string | any, statusCode: number, errorCode: number | null) {
    if (new.target === ExtendableError)
    throw new TypeError(‘Abstract class “ExtendableError” cannot be instantiated directly.’);
    super(message);
    this.name = this.constructor.name;
    this.errorMessage = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
    }
    }
    
    class BadRequest extends ExtendableError {
    constructor(message: string, errorCode: number | null) {
    if (arguments.length === 0 || process.env.ENV === ‘prod’)
    super(‘Bad Request’, 400, errorCode);
    else
    super(message, 400, errorCode);
    }
    }