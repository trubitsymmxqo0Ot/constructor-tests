import { NextFunction, Request, Response } from "express";
import ErrorFabric from "../exceptions/ErrorFabric.ts";
import tokenService from "../services/token-service.ts";

async function isAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if(!header) {
      throw next(ErrorFabric.UserNotAuthorization());
    }
    const accessToken = header?.split(' ')[1];
    if(!accessToken) {
      throw next(ErrorFabric.UserNotAuthorization());
    }
    const userData = tokenService.verifyAccessToken(accessToken);
    if(!userData) {
      throw next(ErrorFabric.UserNotAuthorization());
    }
  } catch(e) {
    throw next(ErrorFabric.UserNotAuthorization());
  }
}

export default isAuthMiddleware;