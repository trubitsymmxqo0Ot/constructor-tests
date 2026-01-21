import { NextFunction, Request, Response } from "express";
import ErrorFabric from "../exceptions/ErrorFabric.ts";

function ErrorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  console.log(err);
  if(err instanceof ErrorFabric) {
    return res.status(err.status).json({message: err.message, errors: err.errors});
  }

  return res.status(500).json({message: "Произошла ошибка на стороне сервера"});
}

export default ErrorMiddleware;