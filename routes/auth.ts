import express from 'express'
import passport from 'passport'
import boom from '@hapi/boom'
import jwt from 'jsonwebtoken'

import ApiKeysService from '../services/apiKeys'
import { envConfig } from '../config'

import '../utils/auth/strategies/basic'

const authApi = (app: express.Application) => {
  const router = express.Router()

  app.use('/api/auth', router)

  const apiKeysService = new ApiKeysService()

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

          const { _id: id, name, email } = user

          const payload = {
            sub: id,
            name,
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
}

export default authApi
