import { EmptyObject } from "../services/errorCodes";

function isEmptyObject(req, res, next) {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    next(EmptyObject);
  } else {
    next();
  }
  return;
}

export { isEmptyObject };
