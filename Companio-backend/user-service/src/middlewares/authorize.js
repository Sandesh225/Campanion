// src/middlewares/authorize.js
import { ForbiddenError } from "../utils/ApiError.js";

const authorize = (roles = []) => {
  // roles can be a single role string (e.g., 'admin') or an array of roles
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(
        "You do not have permission to perform this action."
      );
    }
    next();
  };
};

export default authorize;
