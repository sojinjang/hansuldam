import { NoAdmin } from "../services/errorCodes";

function adminRequired(req, res, next) {
  const { userRole } = req.currentUser;
  if (userRole == "admin") {
    next();
  } else {
    next(NoAdmin);
    return;
  }
}

export { adminRequired };
