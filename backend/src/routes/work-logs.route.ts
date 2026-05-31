import { Op, type WhereOptions } from "sequelize"
import { Router } from "express"
import { z } from "zod"
import { registry } from "../openapi.js"
import { validate } from "../middleware/validate.js"
import { WorkLog, WorkType } from "../models/index.js"

export const workLogsRouter = Router()

const WorkLogBodySchema = registry.register(
  "WorkLogBody",
  z.object({
    date: z.string().min(1).openapi({ example: "2026-05-30" }),
    workTypeId: z.coerce.number().int().positive().openapi({ example: 1 }),
    quantity: z.coerce.number().positive().openapi({ example: 24 }),
    unit: z.string().min(1).max(20).openapi({ example: "м3" }),
    performer: z.string().min(2).max(160).openapi({ example: "Бригада Иванова" }),
    note: z.string().max(1000).optional().nullable().openapi({ example: "Секция А" }),
  }),
)

const WorkLogSchema = registry.register(
  "WorkLog",
  WorkLogBodySchema.extend({
    id: z.number().openapi({ example: 1 }),
    workType: z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .optional(),
  }),
)

const ParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})

const QuerySchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sort: z.enum(["asc", "desc"]).default("desc"),
})

registry.registerPath({
  method: "get",
  path: "/api/work-logs",
  tags: ["Work logs"],
  summary: "Get work logs",
  request: { query: QuerySchema },
  responses: {
    200: {
      description: "Work logs list",
      content: { "application/json": { schema: z.array(WorkLogSchema) } },
    },
  },
})

workLogsRouter.get(
  "/",
  validate({ query: QuerySchema }),
  async (req, res, next) => {
    try {
      const { dateFrom, dateTo, sort } = req.query as z.infer<typeof QuerySchema>
      const dateFilter: Record<symbol, string> = {}

      if (dateFrom) dateFilter[Op.gte] = dateFrom
      if (dateTo) dateFilter[Op.lte] = dateTo

      const where: WhereOptions = Object.getOwnPropertySymbols(dateFilter).length
        ? { date: dateFilter }
        : {}

      const logs = await WorkLog.findAll({
        where,
        include: [{ model: WorkType, as: "workType" }],
        order: [["date", sort.toUpperCase()]],
      })

      res.json(logs)
    } catch (error) {
      next(error)
    }
  },
)

registry.registerPath({
  method: "post",
  path: "/api/work-logs",
  tags: ["Work logs"],
  summary: "Create work log",
  request: {
    body: { content: { "application/json": { schema: WorkLogBodySchema } } },
  },
  responses: {
    201: {
      description: "Created work log",
      content: { "application/json": { schema: WorkLogSchema } },
    },
  },
})

workLogsRouter.post(
  "/",
  validate({ body: WorkLogBodySchema }),
  async (req, res, next) => {
    try {
      const log = await WorkLog.create(req.body)
      const result = await WorkLog.findByPk(log.id, {
        include: [{ model: WorkType, as: "workType" }],
      })
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  },
)

registry.registerPath({
  method: "put",
  path: "/api/work-logs/{id}",
  tags: ["Work logs"],
  summary: "Update work log",
  request: {
    params: ParamsSchema,
    body: { content: { "application/json": { schema: WorkLogBodySchema } } },
  },
  responses: {
    200: {
      description: "Updated work log",
      content: { "application/json": { schema: WorkLogSchema } },
    },
    404: { description: "Work log not found" },
  },
})

workLogsRouter.put(
  "/:id",
  validate({ params: ParamsSchema, body: WorkLogBodySchema }),
  async (req, res, next) => {
    try {
      const log = await WorkLog.findByPk(Number(req.params.id))

      if (!log) {
        res.status(404).json({ message: "Запись не найдена" })
        return
      }

      await log.update(req.body)

      const result = await WorkLog.findByPk(log.id, {
        include: [{ model: WorkType, as: "workType" }],
      })

      res.json(result)
    } catch (error) {
      next(error)
    }
  },
)

registry.registerPath({
  method: "delete",
  path: "/api/work-logs/{id}",
  tags: ["Work logs"],
  summary: "Delete work log",
  request: { params: ParamsSchema },
  responses: {
    204: { description: "Deleted" },
    404: { description: "Work log not found" },
  },
})

workLogsRouter.delete(
  "/:id",
  validate({ params: ParamsSchema }),
  async (req, res, next) => {
    try {
      const deleted = await WorkLog.destroy({ where: { id: req.params.id } })

      if (!deleted) {
        res.status(404).json({ message: "Запись не найдена" })
        return
      }

      res.status(204).send()
    } catch (error) {
      next(error)
    }
  },
)
