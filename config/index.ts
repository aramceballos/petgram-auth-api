import { config } from "dotenv"
config()

export const envConfig = {
  dev: process.env.NODE_ENV !== "production",
  port: process.env.PORT || 5000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbHost: process.env.DB_HOST,
}
