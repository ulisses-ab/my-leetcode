import { ErrorCode } from "./ErrorCode"

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly details?: any;

  constructor(code: ErrorCode, message: string, details?: any) {
    super(message);
    this.code = code;
    this.details = details;
  }
}