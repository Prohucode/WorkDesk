// src/middleware/validate.ts
import type { NextFunction, Request, Response } from "express"
import type { ZodSchema } from "zod"

type ValidateSchemas = {
  body?: ZodSchema
  params?: ZodSchema
  query?: ZodSchema
}

export function validate(schemas: ValidateSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body)
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as typeof req.params
      }

      if (schemas.query) {
        Object.assign(req.query, schemas.query.parse(req.query))
      }

      next()
    } catch (error) {
      res.status(400).json({
        message: "Validation error",
        error,
      })
    }
  }
}
