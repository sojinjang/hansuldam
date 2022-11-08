function isEmptyObject(req, res, next) {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    res.status(406).json({
      result: "Not Acceptable",
      reason: "headers의 Content-Type을 application/json으로 설정해주세요",
    });
  } else {
    next();
  }
  return;
}

export { isEmptyObject };
