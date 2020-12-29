import express from 'express';
import boom from '@hapi/boom';

const notFoundHandler: express.Handler = (_req, res) => {
  const {
    output: { statusCode, payload },
  } = boom.notFound();

  res.status(statusCode).json(payload);
};

export default notFoundHandler;
