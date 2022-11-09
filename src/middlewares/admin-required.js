import { Forbidden } from "../utils/errorCodes";

function adminRequired(req, res, next) {
  const { userRole } = req.currentUser;
  if (userRole == "admin") {
    next();
  } else {
    const NoAdmin = new Forbidden("No Admin", 4003);
    next(NoAdmin);
    return;
  }
}

export { adminRequired };
