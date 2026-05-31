import dotenv from "dotenv"

dotenv.config()

export const config = {
  port: Number(process.env.PORT || 3000),
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgres://workdesk:workdesk@localhost:5432/workdesk",
  sessionSecret: process.env.SESSION_SECRET || "workdesk-secret",
  adminEmail: process.env.ADMIN_EMAIL || "admin@example.com",
  adminPassword: process.env.ADMIN_PASSWORD || "admin",
}
