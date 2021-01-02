import express from 'express'
import passport from 'passport'
import boom from '@hapi/boom'
import jwt from 'jsonwebtoken'

import ApiKeysService from '../services/apiKeys'
import UsersService from '../services/users'
import { envConfig } from '../config'
import validationHandler from '../utils/middlewares/validationHandler'
import { createUserSchema } from '../utils/schemas/users'

import '../utils/auth/strategies/basic'

const authApi = (app: express.Application) => {
  const router = express.Router()

  app.use('/api/auth', router)

  const apiKeysService = new ApiKeysService()
  const usersService = new UsersService()

  router.post('/sign-in', (req, res, next) => {
    const { apiKeyToken } = req.body

    if (!apiKeyToken) {
      next(boom.unauthorized('apiKeyToken is required'))
    }

    passport.authenticate('basic', (error, user) => {
      try {
        if (error || !user) {
          next(boom.unauthorized())
        }

        req.login(user, { session: false }, async (error) => {
          if (error) {
            next(error)
          }

          const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken })

          if (!apiKey) {
            next(boom.unauthorized())
          }

          const { _id: id, name, userName, email } = user

          const payload = {
            sub: id,
            name,
            userName,
            email,
            scopes: apiKey[0].scopes,
          }

          const token = jwt.sign(payload, envConfig.authJwtSecret as string, {
            expiresIn: '15m',
          })

          res.status(200).json({ token, user: { id, name, email } })
        })
      } catch (error) {
        next(error)
      }
    })(req, res, next)
  })

  router.post(
    '/sign-up',
    validationHandler(createUserSchema),
    (req, res, next) => {
      const { body: user } = req

      try {
        const createdUserId = usersService.createUser({ user })

        res.status(201).json({
          data: createdUserId,
          message: 'user created',
        })
      } catch (error) {
        next(error)
      }
    }
  )
}

export default authApi
