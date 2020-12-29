import express from 'express';
import boom, { Boom, Payload } from '@hapi/boom';
import { envConfig } from '../../config';

const withErrorStack = (error: Payload, stack: any) => {
  if (envConfig.dev) {
    return { ...error, stack };
  }

  return error;
};

export const logErrors: express.ErrorRequestHandler = (
  error,
  _req,
  _res,
  next,
) => {
  console.log(error);
  next(error);
};

export const wrapErrors: express.ErrorRequestHandler = (
  error: Boom,
  _req,
  _res,
  next,
) => {
  if (!error.isBoom) {
    next(boom.badImplementation((error as unknown) as string));
  }

  next(error);
};

export const errorHandler: express.ErrorRequestHandler = (
  error: Boom,
  _req,
  res,
  _next,
) => {
  const {
    output: { statusCode, payload },
  } = error;

  res.status(statusCode);
  res.json(withErrorStack(payload, error.stack));
};
