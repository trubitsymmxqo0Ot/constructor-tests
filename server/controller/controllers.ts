import type { NextFunction, Response, Request } from "express";
import userService from "../services/user-service.ts";
import db from "../bd.ts";
import ErrorFabric from "../exceptions/ErrorFabric.ts";

class FormController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const createUser = await userService.register(email, password);
      if (!createUser?.generateTokens && !createUser?.getUserDTO) {
        throw ErrorFabric.BadRequest(
          "При создании пользователя произошла неизвестная ошибка",
        );
      }
      res.cookie("refreshToken", createUser?.generateTokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      console.log("Пользователь успешно создан");
      res.json({
        ...createUser.getUserDTO,
        token: createUser.generateTokens.accessToken,
      });
    } catch (e) {
      next(e);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const {email, password} = req.body;
      const response = await userService.login(email, password);
      if(!response) {
        throw ErrorFabric.BadRequest('Произошла неожиданная ошибка');
      }
      res.cookie('refreshToken', response.generateNewToken.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      console.log('Пользователь успешно вошел!');
      res.json({
        ...response.getUserDTO,
        token: response.generateNewToken.refreshToken,
      });
    } catch(e) {
        next(e);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const {refreshToken} = req.cookies;
      const {email} = req.body;
      if(!refreshToken) {
        throw ErrorFabric.UserNotAuthorization();
      }
      await userService.logout(email, refreshToken);
      res.clearCookie('refreshToken');
      console.log('Пользователь успешно вышел');
      return res.json(500);
    } catch(e) {
      if(e instanceof Error) {
        throw ErrorFabric.BadRequest(e.message);
      }
    }
  }
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw ErrorFabric.UserNotAuthorization();
      }
      const response = await userService.refresh(refreshToken);
      if(!response) {
        throw ErrorFabric.UserNotAuthorization();
      }
      res.cookie("refreshToken", response.generateNewToken.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      console.log('Токены успешно созданы');
      return {
        ...response?.getUserDTO,
        token: response?.generateNewToken.refreshToken,
      }
    } catch (e) {
      next(e);
    }
  }
}

export default new FormController();
