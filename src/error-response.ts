import { Response } from 'express';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export function errorResponse(res: Response, statusCode: StatusCodes) {
  return res.status(statusCode).send({
    error: getReasonPhrase(statusCode),
  });
}
