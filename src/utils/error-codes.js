class ErrorCode extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    // 이 오류생성자가 호출되기 전에 발생한 호출까지만 stack에 쌓는다(보안이슈)
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequest extends ErrorCode {
  constructor(message, errorCode) {
    if (message) super(message, 400, errorCode);
    else super("Bad Request", 400, 400);
  }
}
class Unauthorized extends ErrorCode {
  constructor(message, errorCode) {
    if (message) super(message, 401, errorCode);
    else super("Unauthorized", 401, 401);
  }
}
class Forbidden extends ErrorCode {
  constructor(message, errorCode) {
    if (message) super(message, 403, errorCode);
    else super("Forbidden", 403, 403);
  }
}
class NotFound extends ErrorCode {
  constructor(message, errorCode) {
    if (message) super(message, 404, errorCode);
    else super("NotFound", 404, 404);
  }
}

const UnknownError = {
  code: 1000,
  message: "Unknown error, please report us about it",
};

const DBError = { code: 5100, message: "DB Error" };
const AWSError = 5200;

export { BadRequest, Unauthorized, Forbidden, NotFound, DBError, AWSError };
