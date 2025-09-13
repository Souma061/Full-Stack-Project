import { ZodError } from "zod";

export const validateRequest =
  ({ body, params, query } = {}) =>
  (req, res, next) => {
    try {
      if (body) req.body = body.parse(req.body);
      if (params) req.params = params.parse(req.params);
      if (query) req.query = query.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.flatten(), // { field_name: [errors]
        });
      }
      next(error); // pass to global error handler
    }
  };
