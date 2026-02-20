import { AppError } from '../../application/errors/AppError';
import { ErrorCode } from '../../application/errors/ErrorCode';
import { errorCodeHttpStatusMap } from './errorCodeHttpStatusMap';
import { Response } from 'express';

export function handleError(err: unknown, res: Response) {
  if (err instanceof AppError) {
    const status = errorCodeHttpStatusMap[err.code] || 500;

    return res.status(status).json({
      code: err.code,
      message: err.message,
    });
  }

  console.error('Unhandled error:', err);

  return res.status(500).json({
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
  });
}