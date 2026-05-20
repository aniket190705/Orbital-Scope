import { createHttpError } from "../utils/httpError.js";

export function validateRequest(schema, source = "body") {
  return (req, res, next) => {
    const parsed = schema.safeParse(req[source]);

    if (!parsed.success) {
      return next(
        createHttpError(400, `Invalid ${source} payload.`, parsed.error.flatten())
      );
    }

    req[source] = parsed.data;
    next();
  };
}

export default validateRequest;
