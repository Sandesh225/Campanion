// src/middlewares/validateRequest.js
import { BadRequestError } from "../utils/ApiError.js";

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      throw new BadRequestError("Validation Error", errors);
    }
    next();
  };
};

export default validateRequest;
