import type { NextFunction, Response, Request } from "express";
import userService from "../services/user-service.ts";
import db from "../bd.ts";

class FormController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const createUser = await userService.register(email, password);
      if (!createUser?.generateTokens && !createUser?.getUserDTO) {
        throw new Error(
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
        throw new Error('Произошла неожиданная ошибка');
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
      if(e instanceof Error) {
        throw new Error(e.message);
      }
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const {refreshToken} = req.cookies;
      const {email} = req.body;
      if(!refreshToken) {
        throw new Error('Пользователь не авторизован');
      }
      await userService.logout(email, refreshToken);
      res.clearCookie('refreshToken');
      console.log('Пользователь успешно вышел');
      return res.json(500);
    } catch(e) {
      if(e instanceof Error) {
        throw new Error(e.message);
      }
    }
  }
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw new Error("Пользователь был не найден");
      }
      const response = await userService.refresh(refreshToken);
      if(!response) {
        throw new Error('Пользовать не авторизован');
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
