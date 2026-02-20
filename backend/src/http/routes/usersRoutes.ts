import express, { RequestHandler } from 'express';
import { UsersController } from '../controllers/UsersController';

export function createUsersRoutes(
  authMiddleware: RequestHandler, 
  userController: UsersController
) {
  const router = express.Router();

  router.get("/me",
    authMiddleware,
    userController.getUser.bind(userController)
  );

  return router;
}