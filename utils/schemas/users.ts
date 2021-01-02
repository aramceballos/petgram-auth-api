import joi from '@hapi/joi'

export const userIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/)

export const userSchema = {
  name: joi.string().max(100).required(),
  userName: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
}

export const createUserSchema = {
  ...userSchema,
  isAdmin: joi.boolean(),
}

export const createProviderUserSchema = {
  ...userSchema,
  apiKeyToken: joi.string().required(),
}
