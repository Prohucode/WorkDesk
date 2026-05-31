import express from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express"

import { config } from "./config.js"
import { sequelize } from "./db.js"
import { generateOpenApiDocument } from "./openapi.js"
import "./models/index.js"
import { setupAdmin } from "./admin.js"
import { seedWorkTypes } from "./seed.js"
import { workLogsRouter } from "./routes/work-logs.route.js"
import { workTypesRouter } from "./routes/work-types.route.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/work-logs", workLogsRouter)
app.use("/api/work-types", workTypesRouter)

const openApiDocument = generateOpenApiDocument()

app.get("/openapi.json", (req, res) => {
  res.json(openApiDocument)
})

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument))

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  })
})

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error)
  res.status(500).json({ message: "Внутренняя ошибка сервера" })
})

async function bootstrap() {
  await sequelize.authenticate()
  await sequelize.sync()
  await seedWorkTypes()
  await setupAdmin(app)

  app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`)
    console.log(`AdminJS: http://localhost:${config.port}/admin`)
    console.log(`Swagger UI: http://localhost:${config.port}/api-docs`)
    console.log(`OpenAPI JSON: http://localhost:${config.port}/openapi.json`)
  })
}

bootstrap().catch((error) => {
  console.error(error)
  process.exit(1)
})
