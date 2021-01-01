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
        if (err) {
          cb(boom.unauthorized(), false)
        }
      })

      delete user.password

      return cb(null, user)
    } catch (error) {
      cb(error)
    }
  })
)
