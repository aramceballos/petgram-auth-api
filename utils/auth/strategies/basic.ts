import passport from 'passport'
import { BasicStrategy } from 'passport-http'
import boom from '@hapi/boom'
import bcrypt from 'bcrypt'

import UsersService from '../../../services/users'

passport.use(
  new BasicStrategy(async (email, password, cb) => {
    const usersService = new UsersService()

    try {
      const user = await usersService.getUser({ email })

      if (!user) {
        return cb(boom.unauthorized(), false)
      }

      bcrypt.compare(password, user.password, (err, result) => {
        delete user.password
        if (result) {
          return cb(null, user)
        }

        return cb(boom.unauthorized(), false)
      })
    } catch (error) {
      cb(error)
    }
  })
)
