import { BadRequest } from "../utils/errorCodes";

function isEmptyObject(req, res, next) {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    const EmptyObject = new BadRequest("req.body is EmptyObject", 4004);
    next(EmptyObject);
  } else {
    next();
  }
  return;
}

export { isEmptyObject };
