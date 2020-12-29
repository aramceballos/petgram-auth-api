import express from "express"
import helmet from "helmet"

import { envConfig } from "./config"
import usersApi from "./routes/users"
import {
  logErrors,
  errorHandler,
  wrapErrors,
} from "./utils/middlewares/errorHandlers"
import notFoundHandler from "./utils/middlewares/notFoundHandler"

const app: express.Application = express()

//Body Parser
app.use(express.json())
app.use(helmet())

// Routes
usersApi(app)

// Catch 404
app.use(notFoundHandler)

// Error Handler
app.use(logErrors)
app.use(wrapErrors)
app.use(errorHandler)

app.listen(envConfig.port, () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${envConfig.port}`
  )
})
