import express from "express"
import bcrypt from "bcrypt"

import UsersService from "../services/users"

export default (app: express.Application) => {
  const router = express.Router()

  app.use("/api/users", router)

  const usersService = new UsersService()

  router.get("/", async (_req, res, next) => {
    try {
      const users = await usersService.getUsers()

      res.status(200).json({
        data: users,
        message: "users retrieved",
      })
    } catch (error) {
      next(error)
    }
  })

  router.get("/:userId", async (req, res, next) => {
    const { userId } = req.params

    try {
      const user = await usersService.getUser({ email: userId })

      res.status(200).json({
        data: user,
        message: "user retrieved",
      })
    } catch (error) {
      next(error)
    }
  })
}
