import AdminJS from "adminjs"
import AdminJSExpress from "@adminjs/express"
import { Database, Resource } from "@adminjs/sequelize"
import session from "express-session"
import ConnectSessionSequelize from "connect-session-sequelize"
import type { Express } from "express"
import { config } from "./config.js"
import { sequelize } from "./db.js"
import { WorkLog, WorkType } from "./models/index.js"

AdminJS.registerAdapter({ Database, Resource })

export async function setupAdmin(app: Express) {
  const admin = new AdminJS({
    rootPath: "/admin",
    resources: [
      {
        resource: WorkLog,
        options: {
          navigation: { name: "Журнал работ" },
          properties: {
            id: { isVisible: { list: true, filter: true, show: true, edit: false } },
          },
        },
      },
      {
        resource: WorkType,
        options: {
          navigation: { name: "Журнал работ" },
        },
      },
    ],
    branding: {
      companyName: "Workdesk",
      withMadeWithLove: false,
    },
  })

  const SequelizeStore = ConnectSessionSequelize(session.Store)
  const sessionStore = new SequelizeStore({ db: sequelize })
  await sessionStore.sync()

  const router = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: async (email, password) => {
        if (email === config.adminEmail && password === config.adminPassword) {
          return { email }
        }

        return null
      },
      cookieName: "workdesk_admin",
      cookiePassword: config.sessionSecret,
    },
    null,
    {
      resave: false,
      saveUninitialized: false,
      secret: config.sessionSecret,
      store: sessionStore,
    },
  )

  app.use(admin.options.rootPath, router)
}
