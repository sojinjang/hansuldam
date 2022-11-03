function adminCheck(req, res, next) {
  const { userRole } = req.currentUser;
  if (userRole == "admin") {
    next();
  } else {
    res.status(403).json({
      result: "forbidden-approach",
      reason: "관리자 권한이 필요합니다.",
    });
    return;
  }
}

export { adminCheck };
