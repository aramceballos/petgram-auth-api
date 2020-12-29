import express from 'express';
import { envConfig } from '../config';

const cacheResponse = (res: express.Response, seconds: number) => {
  if (!envConfig.dev) {
    res.set('Cache-control', `public, max-age=${seconds}`);
  }
};

export default cacheResponse;
