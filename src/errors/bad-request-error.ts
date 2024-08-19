import httpStatus from 'http-status';
import { ApplicationError } from './application-error';

export class BadRequestError extends ApplicationError {
  constructor({
    message = 'Bad Request',
    details,
  }: {
    message?: string;
    details?: string[];
  }) {
    super({ message, statusCode: httpStatus.BAD_REQUEST, details });
  }
}
