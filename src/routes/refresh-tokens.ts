import { Request, Router, Response, NextFunction } from 'express';
import { deleteToken, getTokens } from '../controllers/refresh-token.controller';

export default (app: any) => {
  const router = Router();

  // Mount route as "/api/app/authenticated"
  app.use('/api/authenticated', router);

  router.get('/refresh-tokens', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokens: any = await getTokens(req.user, req.query.userId);
      return res.json(tokens);
    } catch (error) {
      next(error);
    }
  });

  router.delete(
    '/refresh-tokens/:token',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { token } = req.params;
        // call refresh token controller
        const response: any = await deleteToken(token, req.user);
        if (response) {
          return res.json(response);
        }
        return res.status(401).json({ message: 'Wrong refresh token' });
      } catch (error) {
        next(error);
      }
    }
  );
};
