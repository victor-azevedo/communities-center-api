export class ApplicationError extends Error {
  private _statusCode: number;

  constructor({ message, statusCode }: ApplicationErrorParams) {
    super(message);
    this._statusCode = statusCode;
  }

  get statusCode(): number {
    return this._statusCode;
  }
}

export interface ApplicationErrorParams {
  message: string;
  statusCode: number;
}
