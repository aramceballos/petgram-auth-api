import passport from "passport"
import { Strategy, ExtractJwt } from "passport-jwt"
import boom from "@hapi/boom"

import UsersService from "../../../services/users"
import { envConfig } from "../../../config"

passport.use(
  new Strategy(
    {
      secretOrKey: envConfig.authJwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (tokenPayload, cb) => {
      const usersService = new UsersService()

      try {
        const user = await usersService.getUser({ email: tokenPayload.email })

        if (!user) {
          return cb(boom.unauthorized(), false)
        }

        delete user.password

        cb(null, { ...user, scopes: tokenPayload.scopes })
      } catch (error) {
        cb(error)
      }
    }
  )
)
