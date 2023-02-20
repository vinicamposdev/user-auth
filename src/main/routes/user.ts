import { Request, Router, Response, NextFunction } from 'express';
import {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  updateUserController,
} from '../controllers/user.controller';

export default (app: any) => {
  const router = Router();

  // Mount route as "/api/app/authenticated"
  app.use('/api/authenticated', router);

  router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loggedInUser: any = Object.assign({}, req.user); // temp fix for typescript error
      const user: any = await getUser(loggedInUser.id, req.user);
      if (user) {
        return res.json(user);
      }
      return res.status(204).json({});
    } catch (error) {
      next(error);
    }
  });

  router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users: any = await getUsers(
        req.user,
        parseInt(req.query.page as string, 10),
        parseInt(req.query.limit as string, 10),
        req.query
      );
      if (!users) {
        return res.status(204).json({});
      }
      let response: any = { success: true };
      for (let item in users) {
        response[item] = users[item];
      }
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.post('/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response: any = await addUser(req.body, req.user);
      if (response && response.exists) {
        return res.status(409).json({ success: false, message: 'User already exists' });
      }
      if (response) {
        return res.status(201).json({ success: true, response });
      }
      return res.status(204).json({});
    } catch (error) {
      return next(error);
    }
  });

  router.get('/users/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const user: any = await getUser(userId, req.user);
      if (user) {
        return res.json(user);
      }
      return res.status(204).json({});
    } catch (error) {
      next(error);
    }
  });

  router.patch('/users/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const user: any = await updateUserController(userId, req.body, req.user);
      if (user) {
        return res.json(user);
      }
      return res.status(204).json({});
    } catch (error) {
      next(error);
    }
  });

  router.delete('/users/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const user: any = await deleteUser(userId, req.user);
      if (user) {
        return res.json(user);
      }
      return res.status(204).json({});
    } catch (error) {
      next(error);
    }
  });
};
