import { Request, Router, Response, NextFunction } from 'express';
import {
  forgotPassword,
  login,
  refreshToken,
  register,
  resetPassword,
} from '../controllers/auth.controller';

export default (app: any) => {
  const router = Router();

  // Mount route as "/api/app"
  app.use('/api', router);

  router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, client } = req.body;
      const response = await login(email, password, client);
      if (response) {
        return res.json(response);
      }
      return res
        .status(401)
        .json({ message: 'The username or password is wrong please check and try again' });
    } catch (error) {
      return next(error);
    }
  });

  router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response: any = await register(req.body);
      if (response && response.exists) {
        return res.status(403).json({ success: false, message: 'User already exists' });
      }
      if (response) {
        return res.status(201).json({ success: true, response });
      }
      return res.status(204).json({});
    } catch (error) {
      return next(error);
    }
  });

  router.post('/refresh-token', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      // call refresh token controller
      const response: any = await refreshToken(token);
      if (response && response.token) {
        return res.json(response);
      }
      return res.status(401).json({ message: 'Wrong refresh token' });
    } catch (error) {
      next(error);
    }
  });

  router.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response: any = await forgotPassword(req.body.email);
      if (response && response['success'] == true) {
        return res.status(200).json({
          success: true,
          message: 'A link to reset password was sent to the email',
        });
      }
    } catch (error) {
      return next(error);
    }
  });

  router.post('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token: string = String(req.body.token);
      const email: string = String(req.body.email);
      const password: string = String(req.body.password);
      const response: any = await resetPassword(email, password, token);
      if (response && response['success'] == true) {
        return res.status(200).json({
          success: true,
          message:
            'Your password was updated succesfully. Now you can login with your new password',
        });
      }
      if (response && !response.exists) {
        return res.status(403).json({ success: false });
      }
    } catch (error) {
      return next(error);
    }
  });
};
