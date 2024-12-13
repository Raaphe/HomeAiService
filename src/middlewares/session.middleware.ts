// src/middlewares/session.middleware.ts
import session from 'express-session';
import { config } from '../config/config.ts';

export const sessionMiddleware = session({
  secret: config.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: config.ENV === 'production' }
});
