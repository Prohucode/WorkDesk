import { Router } from "express"
import { z } from "zod"
import { registry } from "../openapi.js"
import { validate } from "../middleware/validate.js"
import { WorkType } from "../models/index.js"

export const workTypesRouter = Router()

const WorkTypeSchema = registry.register(
  "WorkType",
  z.object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: "Кладка перегородок" }),
  }),
)

const WorkTypeBodySchema = registry.register(
  "WorkTypeBody",
  z.object({
    name: z.string().min(2).max(120).openapi({
      example: "Монтаж кровли",
    }),
  }),
)

registry.registerPath({
  method: "get",
  path: "/api/work-types",
  tags: ["Work types"],
  summary: "Get work types",
  responses: {
    200: {
      description: "Work types list",
      content: {
        "application/json": {
          schema: z.array(WorkTypeSchema),
        },
      },
    },
  },
})

workTypesRouter.get("/", async (_req, res, next) => {
  try {
    const workTypes = await WorkType.findAll({ order: [["name", "ASC"]] })
    res.json(workTypes)
  } catch (error) {
    next(error)
  }
})

registry.registerPath({
  method: "post",
  path: "/api/work-types",
  tags: ["Work types"],
  summary: "Create work type if it does not exist",
  request: {
    body: {
      content: {
        "application/json": {
          schema: WorkTypeBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Existing work type",
      content: {
        "application/json": {
          schema: WorkTypeSchema,
        },
      },
    },
    201: {
      description: "Created work type",
      content: {
        "application/json": {
          schema: WorkTypeSchema,
        },
      },
    },
  },
})

workTypesRouter.post(
  "/",
  validate({ body: WorkTypeBodySchema }),
  async (req, res, next) => {
    try {
      const name = req.body.name.trim()
      const [workType, created] = await WorkType.findOrCreate({
        where: { name },
        defaults: { name },
      })

      res.status(created ? 201 : 200).json(workType)
    } catch (error) {
      next(error)
    }
  },
)
