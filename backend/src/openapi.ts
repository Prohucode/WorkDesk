// src/openapi.ts
import { z } from "zod"
import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi"

extendZodWithOpenApi(z)

export const registry = new OpenAPIRegistry()

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions)

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Construction Work Log API",
      version: "1.0.0",
      description: "API журнала выполненных работ на строительном объекте",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  })
}

export const ErrorResponseSchema = registry.register(
  "ErrorResponse",
  z.object({
    message: z.string(),
    error: z.unknown().optional(),
  }),
)
