import { NextFunction } from 'express'
import boom from '@hapi/boom'
import joi from '@hapi/joi'

const validate = (data: any, schema: any) => {
  const joiSchema = joi.object(schema)
  const { error } = joiSchema.validate(data)
  return error
}

const validationHandler = (schema: any, check = 'body') => (
  req: any,
  _res: any,
  next: NextFunction
) => {
  const error = validate(req[check], schema)

  error ? next(boom.badRequest(error.toString())) : next()
}

export default validationHandler
