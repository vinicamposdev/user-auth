import { Router, Request, Response, NextFunction } from 'express';

import authentication from './auth';
import users from './user';
import refreshTokens from './refresh-tokens';

export default (app: any) => {
  const router = Router();

  // Mount route as "/api/app"
  app.use('/api', router);

  router.get('/', (request, response) => {
    response.json({
      message: '######## Welcome to the API #########',
    });
  });

  authentication(app);
  users(app);
  refreshTokens(app);

  // catch 404 and forward to error handler
  app.use('/', (req: Request, res: Response, next: NextFunction) => {
    const err: any = new Error(`The requested resource could not be found: ${req.path}`);
    err.status = 404;
    next(err);
  });

  app.use('/', (error: any, req: Request, res: Response, next: NextFunction) => {
    let code = parseInt(error.code || error.status, 10) || 500;
    if (code < 100 || code > 600) {
      code = 500;
    }
    const errorInfo: any = {
      code,
      message: error.message,
    };
    // development error handle will print stacktrace
    if (process.env.production !== 'true') {
      errorInfo.error = error;
    }
    console.error(errorInfo);
    res.status(code).json(errorInfo);
  });
};
