import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { ApplicationError } from '../errors/application-error';

export const handleApplicationError = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const bodyErrorResponse: {
    message: string;
    stack?: string;
  } = {
    message: err.message,
  };

  console.error(err);

  // Adiciona o stack apenas em ambiente de desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
    bodyErrorResponse.stack = err.stack;
  }

  // Tratamento de erro da aplicação
  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json(bodyErrorResponse);
  }

  // Tratamento de erro de validação do Mongoose como status 400
  if (err.name === 'ValidationError') {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: err.message,
    });
  }

  // Erros não tratados retornam erro 500
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: 'Internal server error',
  });
};
