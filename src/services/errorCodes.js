const UnknownError = {
  code: 1000,
  message: "Unknown error, please report us about it",
};
const ValidationError = { code: 4000, message: "Data invalid" };
const SyntaxError = 4001;
const NoPermission = {
  code: 4002,
  message: "No permission to perform this action",
};
const DBError = { code: 5100, message: "DB Error" };
const AWSError = 5200; // AWS 관련 에러

export {
  UnknownError,
  ValidationError,
  SyntaxError,
  NoPermission,
  DBError,
  AWSError,
};
