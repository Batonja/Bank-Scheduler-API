import { NextFunction, Request, Response } from "express";

class ErrorController {
  public handleError(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { message, stack, statusCode } = error;

    res.status(statusCode).send({ message, stack });
  }
}

export default new ErrorController();
